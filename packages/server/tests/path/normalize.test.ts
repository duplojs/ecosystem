import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import * as DSPath from "@scripts/path";
import * as DSCommon from "@scripts/common";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("normalize", () => {
	beforeEach(() => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.windows);
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.declareAbsolutePath("/DRV-D:/work")));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
		vi.restoreAllMocks();
	});

	it.each([
		["C:\\foo", "/DRV-C:/foo"],
		["c:/foo", "/DRV-C:/foo"],
		["Z:\\", "/DRV-Z:"],
		["C:", "/DRV-C:"],
		["C:relative", "C:relative"],
		["dir/C:relative/file", "dir/C:relative/file"],
		["dir/C:/file", "dir/DRV-C:/file"],
		["../c:/file", "../DRV-C:/file"],
		["C:/D:/e:/file", "/DRV-C:/DRV-D:/DRV-E:/file"],
		["dir/C:/D:/file", "dir/DRV-C:/DRV-D:/file"],
		["/DRV-C:/dir/D:/file", "/DRV-C:/dir/DRV-D:/file"],
		["/C:/file", "/DRV-C:/file"],
		["/foo", "/DRV-D:/foo"],
		["/", "/DRV-D:"],
		["/file:/foo", "/DRV-D:/file:/foo"],
		["file:/C:/foo", "file:/DRV-C:/foo"],
		["C:\\foo\\..\\bar", "/DRV-C:/bar"],
		["C:\\..", "/DRV-D:"],
		["C:\\..\\other", "/DRV-D:/other"],
		["C:\\..\\..\\other", "/DRV-D:/other"],
		["\\\\server\\share\\foo", "/UNC:/server/share/foo"],
		["//server/share", "/UNC:/server/share"],
		["\\\\server\\share\\..\\..\\foo", "/UNC:/foo"],
		["\\\\server\\share\\..\\..\\..\\foo", "/DRV-D:/foo"],
		["\\\\.\\pipe\\name", "/DEVICE:/pipe/name"],
		["\\\\.\\PhysicalDrive0", "/DEVICE:/PhysicalDrive0"],
		["//./C:/foo", "/DEVICE:/DRV-C:/foo"],
		["//./pipe/../../foo", "/DRV-D:/foo"],
		["\\\\?\\C:\\foo", "/DRV-C:/foo"],
		["//?/UNC/server/share/foo", "/UNC:/server/share/foo"],
		["//?/unc/server/share/../foo", "/UNC:/server/foo"],
		["//?///./pipe/name", "/DEVICE:/pipe/name"],
		["//?/Volume{example}/foo", "/DEVICE:/Volume{example}/foo"],
		["//?/Volume{example}", "/DEVICE:/Volume{example}"],
		["//?/Volume{example}/../foo", "/DEVICE:/foo"],
		["//?/Volume{example}/../../foo", "/DRV-D:/foo"],
		["file:////%3F/Volume{example}/foo", "/DEVICE:/Volume{example}/foo"],
		["\\\\?\\GLOBALROOT\\Device\\HarddiskVolume1\\foo", "/DEVICE:/GLOBALROOT/Device/HarddiskVolume1/foo"],
		["//?/GLOBALROOT", "/DEVICE:/GLOBALROOT"],
		["//?/globalroot/Device/foo", "/DEVICE:/globalroot/Device/foo"],
		["//?/GLOBALROOT/Device/../foo", "/DEVICE:/GLOBALROOT/foo"],
		["//?/GLOBALROOT/../foo", "/DEVICE:/foo"],
		["//?/GLOBALROOT/../../foo", "/DRV-D:/foo"],
		["file:////%3F/GLOBALROOT/Device/foo", "/DEVICE:/GLOBALROOT/Device/foo"],
		["//?/GLOBALROOTish/foo", "GLOBALROOTish/foo"],
		["GLOBALROOT/Device/foo", "GLOBALROOT/Device/foo"],
		["//?/file:///C:/foo", "/DRV-C:/foo"],
		["file:///C:/foo", "/DRV-C:/foo"],
		["FILE:///c:/foo", "/DRV-C:/foo"],
		["file://C:/foo", "/DRV-C:/foo"],
		["file:///C:", "/DRV-C:"],
		["file://localhost/C:/foo", "/DRV-C:/foo"],
		["file://SERVER/share/foo", "/UNC:/server/share/foo"],
		["file://server/share/../../foo", "/UNC:/server/foo"],
		["file://server", "/UNC:/server"],
		["file:////./pipe/name", "/UNC:/pipe/name"],
		["file:////%3F/C:/foo", "/DRV-C:/foo"],
		["file:\\\\C:\\foo", "/DRV-C:/foo"],
		["file:///C:/foo//bar/../baz/", "/DRV-C:/foo/baz"],
		["file:///C:/../foo", "/DRV-C:/foo"],
		["file:///C:/%2e%2e/foo", "/DRV-C:/foo"],
		["file:///C:/%2F..%2Ffoo", "/DRV-D:/foo"],
		["file:///C:/call%20site/%C3%A9%23.txt", "/DRV-C:/call site/é#.txt"],
		["file:///C:/foo%252F.txt", "/DRV-C:/foo%2F.txt"],
		["file:///C:/foo%2Fbar", "/DRV-C:/foo/bar"],
		["file:///C:/foo%5Cbar", "/DRV-C:/foo/bar"],
		["file:///C:/a%2F..%2Ffoo", "/DRV-C:/foo"],
		["file:///C:/foo?query=ignored#fragment", "/DRV-C:/foo"],
		["file:///DRV-C:/foo", "/DRV-C:/foo"],
		["file:///UNC:/server/share", "/UNC:/server/share"],
		["file:///DEVICE:/pipe/name", "/DEVICE:/pipe/name"],
		["//?//DRV-C:/foo", "/DRV-C:/foo"],
		["/DRV-C:/foo/../bar/", "/DRV-C:/bar"],
		["/UNC:/server/../../foo", "/DRV-D:/foo"],
		["/DEVICE:/pipe/../../foo", "/DRV-D:/foo"],
		["/DRV-C:/..", "/DRV-D:"],
		["", "."],
		["foo\\bar", "foo/bar"],
		["..\\foo\\..\\bar", "../bar"],
		["foo/../C:/bar", "DRV-C:/bar"],
		["foo/../C:", "DRV-C:"],
		["./file:///C:/foo", "file:/DRV-C:/foo"],
		["/file:///C:/foo", "/DRV-D:/file:/DRV-C:/foo"],
		["/foo/../bar/", "/DRV-D:/bar"],
	])("normalizes %j into %j with stable, valid results", (input, expected) => {
		const result = DSPath.normalize(input);

		expect(result).toBe(expected);
		expect(DPath.is(result!)).toBe(true);
		expect(DSPath.normalize(result!)).toBe(result);
		expect(DSPath.normalize(input)).toBe(result);

		type _Check = DCommon.ExpectType<typeof result, DPath.AnyPath | null, "strict">;
	});

	it.each([
		"/DRV-C:/foo",
		"/DRV-c:",
		"/UNC:/server/share",
		"/UNC:",
		"/DEVICE:/pipe/name",
		"/DEVICE:",
		".",
		"..",
		"../../foo",
		"foo/bar",
		"DRV-C:/foo",
		"dir/DRV-C:/foo",
		"/DEVICE:/Volume{example}/foo",
		"/DEVICE:/GLOBALROOT/Device/foo",
		"C:foo",
		"file:./foo",
	])("preserves the normalized path %j", (input) => {
		expect(DPath.is(input)).toBe(true);
		expect(DSPath.normalize(input)).toBe(input);
	});

	it.each([
		"C:\\bad\0name",
		"/DRV-C:/bad\0name",
		"file:///C:/foo\0bar",
		"file://user@localhost/C:/foo",
		"file://localhost:80/C:/foo",
		"file:///C:/foo%00bar",
		"file:///foo%00bar",
		"file:///C:/foo%",
		"file:///C:/foo%GG",
		"file:///C:/foo%C3",
	])("rejects invalid input %j", (input) => {
		expect(DSPath.normalize(input)).toBeNull();
	});

	it("returns null when nested prefixes exceed the call stack", () => {
		const input = `${DString.repeat("//?/", 10_000)}C:/foo`;

		const result = DSPath.normalize(input);

		expect(result).toBeNull();
	});

	describe("current drive", () => {
		beforeEach(() => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.declareAbsolutePath("/DRV-D:/work")));
		});

		it.each([
			["\\foo", "/DRV-D:/foo"],
			["\\", "/DRV-D:"],
			["\\..\\foo", "/DRV-D:/foo"],
			["file:///foo", "/DRV-D:/foo"],
			["file:\\\\\\foo", "/DRV-D:/foo"],
			["//?//foo", "/DRV-D:/foo"],
			["file:///", "/DRV-D:"],
			["file://localhost", "/DRV-D:"],
			["file:///../foo", "/DRV-D:/foo"],
		])("adds the drive before resolving %j into %j", (input, expected) => {
			const result = DSPath.normalize(input);

			expect(result).toBe(expected);
			expect(DPath.is(result!)).toBe(true);
			expect(DSPath.normalize(result!)).toBe(result);
		});

		it("reads the drive for each call", () => {
			const directory = vi.fn()
				.mockReturnValueOnce(DEither.success(DPath.declareAbsolutePath("/DRV-C:/work")))
				.mockReturnValueOnce(DEither.success(DPath.declareAbsolutePath("/DRV-e:/work")));
			TESTImplementation.set("getCurrentWorkDirectory", directory);

			expect(DSPath.normalize("\\foo")).toBe("/DRV-C:/foo");
			expect(DSPath.normalize("\\foo")).toBe("/DRV-E:/foo");
			expect(directory).toHaveBeenCalledTimes(2);
		});

		it("returns null when cwd is unavailable", () => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error("unavailable"));

			expect(DSPath.normalize("\\foo")).toBeNull();
		});

		it("returns null when traversal removes the namespace and cwd is unavailable", () => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error("unavailable"));

			expect(DSPath.normalize("C:/../foo")).toBeNull();
		});

		it.each([
			["/DRV-C:/foo", "/DRV-C:/foo"],
			["dir/C:/foo", "dir/DRV-C:/foo"],
			["dir/../C:/foo", "DRV-C:/foo"],
			["C:foo", "C:foo"],
			["//?/GLOBALROOT/Device/foo", "/DEVICE:/GLOBALROOT/Device/foo"],
		])("normalizes %j without reading cwd", (input, expected) => {
			const directory = vi.fn(() => DEither.error("unavailable"));
			TESTImplementation.set("getCurrentWorkDirectory", directory);

			expect(DSPath.normalize(input)).toBe(expected);
			expect(directory).not.toHaveBeenCalled();
		});

		it("returns null when cwd has no drive", () => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.declareAbsolutePath("/UNC:/server/share")));

			expect(DSPath.normalize("\\foo")).toBeNull();
		});

		it("normalizes the system cwd without recursively reading cwd", () => {
			setEnvironment("NODE");
			const cwd = vi.spyOn(process, "cwd").mockReturnValue("C:\\work");

			const result = DSCommon.getCurrentWorkDirectory();

			expect(DEither.unwrapByInformationOrThrow(result, "success")).toBe("/DRV-C:/work");
			expect(cwd).toHaveBeenCalledOnce();
		});
	});

	describe("POSIX", () => {
		beforeEach(() => vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux));

		it.each([
			["/tmp/a/../b/", "/tmp/b"],
			["a\\b", "a\\b"],
			["C:\\foo", "C:\\foo"],
			["file:///tmp/foo", "/tmp/foo"],
			["", "."],
		])("uses lang normalization for %j", (input, expected) => {
			expect(DSPath.normalize(input)).toBe(expected);
		});

		it("rejects NUL", () => {
			expect(DSPath.normalize("a\0b")).toBeNull();
		});
	});
});
