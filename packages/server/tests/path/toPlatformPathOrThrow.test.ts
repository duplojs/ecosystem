import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DSPath from "@scripts/path";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("toPlatformPathOrThrow", () => {
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
		["/DRV-C:/foo", "C:\\foo"],
		["/DRV-C:", "C:\\"],
		["/UNC:/server/share", "\\\\server\\share"],
		["/DEVICE:/GLOBALROOT/Device/foo", "\\\\?\\GLOBALROOT\\Device\\foo"],
		["dir/DRV-C:/foo", "dir\\C:\\foo"],
		["/tmp", "D:\\tmp"],
		["foo\\bar", "foo_bar"],
		["/DRV-C:/foo\\bar/baz", "C:\\foo_bar\\baz"],
		["/DEVICE:/GLOBALROOT/Device/foo\\bar", "\\\\?\\GLOBALROOT\\Device\\foo_bar"],
	])("converts %j into %j", (path, expected) => {
		const result = DSPath.toPlatformPathOrThrow(DPath.createOrThrow(path));

		expect(result).toBe(expected);

		type _Check = DCommon.ExpectType<typeof result, string, "strict">;
	});

	it.each([
		"/UNC:",
		"/UNC:/server",
		"/UNC:/?/share",
		"/DEVICE:",
	])("throws InvalidPlatformPathError for %j", (path) => {
		const input = DPath.createOrThrow(path);

		expect(() => DSPath.toPlatformPathOrThrow(input)).toThrow(DSPath.InvalidPlatformPathError);
	});

	it("throws when the current drive cannot be obtained", () => {
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.left("get-current-work-directory-error", "unavailable"));

		expect(() => DSPath.toPlatformPathOrThrow(DPath.declareAbsolutePath("/tmp")))
			.toThrow(DSPath.InvalidPlatformPathError);
	});

	it("preserves POSIX paths", () => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux);
		const path = DPath.declarePath("foo\\bar");

		expect(DSPath.toPlatformPathOrThrow(path)).toBe(path);
	});
});
