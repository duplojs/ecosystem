import { DSCommon } from "@scripts";
import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import { win32 } from "node:path";
import { currentOS, OS } from "@scripts/implementor";

describe("platformPath", () => {
	beforeEach(() => vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.windows));
	afterEach(() => vi.restoreAllMocks());

	it.each([
		{
			input: "C:\\Users\\math",
			universal: "/C:/Users/math",
			platform: "C:\\Users\\math",
		},
		{
			input: "C:\\CON report.txt",
			universal: "/C:/CON report.txt",
			platform: "C:\\CON report.txt",
		},
		{
			input: "d:\\Projects",
			universal: "/D:/Projects",
			platform: "D:\\Projects",
		},
		{
			input: "c:\\",
			universal: "/C:",
			platform: "C:\\",
		},
		{
			input: "C:\\..\\..\\foo",
			universal: "/C:/foo",
			platform: "C:\\foo",
		},
		{
			input: "C:/foo\\bar//../été-猫",
			universal: "/C:/foo/été-猫",
			platform: "C:\\foo\\été-猫",
		},
		{
			input: "foo\\bar",
			universal: "foo/bar",
			platform: "foo\\bar",
		},
		{
			input: "..\\..\\foo\\..\\bar",
			universal: "../../bar",
			platform: "..\\..\\bar",
		},
		{
			input: "",
			universal: ".",
			platform: ".",
		},
		{
			input: ".",
			universal: ".",
			platform: ".",
		},
		{
			input: "..",
			universal: "..",
			platform: "..",
		},
		{
			input: "\\\\server\\share",
			universal: "/UNC:/server/share",
			platform: "\\\\server\\share",
		},
		{
			input: "//server/share/a\\b",
			universal: "/UNC:/server/share/a/b",
			platform: "\\\\server\\share\\a\\b",
		},
		{
			input: "\\\\server\\share\\..\\..\\foo",
			universal: "/UNC:/server/share/foo",
			platform: "\\\\server\\share\\foo",
		},
	])("converts $input via $universal", ({ input, universal, platform }) => {
		const result = DSCommon.normalizePlatformPath(input);
		type _Check = DCommon.ExpectType<typeof result, (string & DPath.Path) | null, "strict">;
		type _CheckPlatformInput = DCommon.ExpectType<Parameters<typeof DSCommon.toPlatformPath>[0], DPath.AnyPath, "strict">;
		expect(result).toBe(universal);
		expect(DPath.is(result!)).toBe(true);
		expect(DSCommon.toPlatformPath(result!)).toBe(platform);
		expect(DSCommon.normalizePlatformPath(platform)).toBe(universal);
	});

	it.each([
		"C:foo\\bar",
		"\\foo",
		"\\\\server",
		"\\\\server\\",
		"\\\\\\server\\share",
		"\\\\?\\C:\\foo",
		"\\\\.\\C:\\foo",
		"\\\\?\\UNC\\server\\share",
		"file://server/share/foo",
		"file:///C:/foo",
		"FILE:./C:/foo",
		"/C:/Users/math",
		"/UNC:/server/share/file.txt",
		"/C:/foo/../bar",
		"C:foo",
		"C:",
		"/foo",
		"//./pipe/name",
		"\\\\.\\pipe\\foo",
		"C:\\bad\u0000",
		"\\\\..\\share",
		"\\\\server\\..",
	])("rejects platform Windows path %s", (path) => {
		expect(DSCommon.normalizePlatformPath(path)).toBeNull();
		expect(() => DSCommon.normalizePlatformPathOrThrow(path)).toThrow(DSCommon.InvalidPlatformPathError);
	});

	it.each([
		{
			input: "foo/bar",
			expected: "foo/bar",
		},
		{
			input: "d:/Projects",
			expected: "/D:/Projects",
		},
	])("normalizes Windows path $input with forward slashes", ({ input, expected }) => {
		expect(DSCommon.normalizePlatformPath(input)).toBe(expected);
	});

	it.each([
		"/",
		"/C",
		"/CC:/foo",
		"/UNC:",
		"/UNC:/server",
		"/UNC:/?/C:/Windows",
		"/UNC:/?/GLOBALROOT/Device/example",
		"/unc:/server/share",
		"/C:/a\\b",
		"C:foo",
		"C:",
		"C:/foo",
		"foo\\bar",
	])("rejects virtual Windows path %s", (path) => {
		expect(DSCommon.toPlatformPath(DPath.createOrThrow(path))).toBeNull();
		expect(() => DSCommon.toPlatformPathOrThrow(DPath.createOrThrow(path)))
			.toThrow(DSCommon.InvalidPlatformPathError);
	});

	it.each([
		{
			input: "C:\\NUL",
			expected: "/C:/NUL",
		},
		{
			input: "C:\\file:stream",
			expected: "/C:/file:stream",
		},
		{
			input: "C:\\name.",
			expected: "/C:/name.",
		},
		{
			input: "C:\\name ",
			expected: "/C:/name ",
		},
		{
			input: "C:\\bad?",
			expected: "/C:/bad?",
		},
		{
			input: "C:\\bad\u001f",
			expected: "/C:/bad\u001f",
		},
		{
			input: "\\\\server\\share.\\foo",
			expected: "/UNC:/server/share./foo",
		},
	])("converts $input without validating filesystem naming rules", ({ input, expected }) => {
		expect(DSCommon.normalizePlatformPath(input)).toBe(expected);
		expect(DSCommon.toPlatformPath(DPath.createOrThrow(expected))).toBe(input);
	});

	it.each(["NUL", "CON.txt", "file:stream"] as const)("passes relative filename %s through", (path) => {
		expect(DSCommon.toPlatformPath(DPath.declarePath(path))).toBe(path);
	});

	it("normalizes dot segments without checking filesystem names", () => {
		expect(DSCommon.normalizePlatformPath("C:\\NUL\\..\\safe")).toBe("/C:/safe");
	});

	it("resolves across volumes in the virtual tree", () => {
		const result = DPath.resolveRelative([DPath.declarePath("/C:/project"), DPath.declarePath("../../D:/other")]);
		expect(result).toBe("/D:/other");
		expect(DSCommon.toPlatformPath(result)).toBe("D:\\other");
		expect(DSCommon.toPlatformPath(DPath.resolveRelative([DPath.declarePath("/C:"), DPath.declarePath("..")]))).toBeNull();
	});

	it.each([
		{
			path: "C:\\a\\..\\b",
			expected: "C:\\b",
		},
		{
			path: "C:\\..\\b",
			expected: "C:\\b",
		},
		{
			path: "\\\\s\\share\\..\\b",
			expected: "\\\\s\\share\\b",
		},
	])("agrees with win32 platform anchoring for $path", ({ path, expected }) => {
		expect(win32.normalize(path)).toBe(expected);
		expect(DSCommon.toPlatformPath(DSCommon.normalizePlatformPathOrThrow(path))).toBe(expected);
	});

	it.each([
		{
			input: "/tmp/a/../b/",
			expected: "/tmp/b",
		},
		{
			input: "a\\b",
			expected: "a\\b",
		},
		{
			input: "C:\\Users\\math",
			expected: "C:\\Users\\math",
		},
		{
			input: "file:///literal",
			expected: "/literal",
		},
		{
			input: "/C:/file:stream",
			expected: "/C:/file:stream",
		},
		{
			input: "../../file",
			expected: "../../file",
		},
		{
			input: "/",
			expected: "/",
		},
	])("preserves POSIX conventions for $input", ({ input, expected }) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux);
		expect(DSCommon.normalizePlatformPath(input)).toBe(expected);
		expect(DSCommon.toPlatformPath(DPath.createOrThrow(expected))).toBe(expected);
	});

	it("rejects NUL on POSIX", () => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux);
		expect(DSCommon.normalizePlatformPath("a\0b")).toBeNull();
	});

	it("uses the current platform and exposes throwing variants", () => {
		const getOS = vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.windows);
		expect(DSCommon.normalizePlatformPathOrThrow("c:\\a")).toBe("/C:/a");
		expect(DSCommon.toPlatformPathOrThrow(DPath.declarePath("/c:/a"))).toBe("C:\\a");
		expect(DSCommon.toPlatformPath(DPath.declarePath("/C:"))).toBe("C:\\");
		getOS.mockReturnValue(OS.linux);
		expect(DSCommon.toPlatformPath(DPath.declarePath("/tmp"))).toBe("/tmp");
		expect(DSCommon.normalizePlatformPath("/tmp")).toBe("/tmp");
	});

	it("keeps long paths lexical without adding device prefixes", () => {
		const path = `/C:/${DString.repeat("a", 300)}`;
		expect(DSCommon.normalizePlatformPath(DSCommon.toPlatformPathOrThrow(DPath.createOrThrow(path)))).toBe(path);
	});
	it.each([
		{
			path: "directory/../target",
			os: OS.linux,
			expected: "target",
		},
		{
			path: "C:\\directory\\..\\target",
			os: OS.windows,
			expected: "/C:/target",
		},
		{
			path: "directory//./../target",
			os: OS.linux,
			expected: "target",
		},
	] as const)("normalizes dot segments in $path", ({ path, os, expected }) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);
		expect(DSCommon.normalizePlatformPathOrThrow(path)).toBe(expected);
	});

	it("preserves leading relative link traversal and literal POSIX backslashes", () => {
		expect(DSCommon.normalizePlatformPathOrThrow("..\\target")).toBe("../target");
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux);
		expect(DSCommon.normalizePlatformPathOrThrow("directory\\..\\target")).toBe("directory\\..\\target");
		expect(DSCommon.normalizePlatformPathOrThrow("target")).toBe("target");
	});
});
