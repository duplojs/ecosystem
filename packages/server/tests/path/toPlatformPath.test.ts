import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";
import * as DSPath from "@scripts/path";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("toPlatformPath", () => {
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
		["/DRV-C:/Users/math", "C:\\Users\\math"],
		["/DRV-c:", "C:\\"],
		["/drv-z:/foo", "Z:\\foo"],
		["/DRV-C:/dir/DRV-d:/file", "C:\\dir\\D:\\file"],
		["/DRV-C:/NUL", "C:\\NUL"],
		["/DRV-C:/file:stream", "C:\\file:stream"],
		["/DRV-C:/name.", "C:\\name."],
		["/DRV-C:/name ", "C:\\name "],
		["/DRV-C:/bad?", "C:\\bad?"],
		["/DRV-C:/bad\u001f", "C:\\bad\u001f"],
		["/UNC:/server/share", "\\\\server\\share"],
		["/UNC:/server/share/foo", "\\\\server\\share\\foo"],
		["/unc:/SERVER/share/DRV-c:/foo", "\\\\SERVER\\share\\C:\\foo"],
		["/DEVICE:/pipe/name", "\\\\.\\pipe\\name"],
		["/device:/PhysicalDrive0", "\\\\.\\PhysicalDrive0"],
		["/DEVICE:/DRV-C:", "\\\\.\\C:"],
		["/DEVICE:/DRV-C:/foo", "\\\\.\\C:\\foo"],
		["/DEVICE:/Volume{example}", "\\\\?\\Volume{example}\\"],
		["/DEVICE:/volume{example}/foo", "\\\\?\\volume{example}\\foo"],
		["/DEVICE:/Volume{example}/DRV-C:/foo", "\\\\?\\Volume{example}\\C:\\foo"],
		["/DEVICE:/GLOBALROOT", "\\\\?\\GLOBALROOT"],
		["/DEVICE:/GLOBALROOT/Device/HarddiskVolume1/foo", "\\\\?\\GLOBALROOT\\Device\\HarddiskVolume1\\foo"],
		["/DEVICE:/globalroot/Device/foo", "\\\\?\\globalroot\\Device\\foo"],
		["/DEVICE:/GLOBALROOTish/foo", "\\\\.\\GLOBALROOTish\\foo"],
		["/DEVICE:/Volume{example}suffix/foo", "\\\\.\\Volume{example}suffix\\foo"],
		[".", "."],
		["..", ".."],
		["../../foo", "..\\..\\foo"],
		["foo/bar", "foo\\bar"],
		["foo\\bar", "foo_bar"],
		["foo\\\\bar", "foo__bar"],
		["\\", "_"],
		["foo\\bar/baz\\qux", "foo_bar\\baz_qux"],
		["/DRV-C:/foo\\bar/baz\\qux", "C:\\foo_bar\\baz_qux"],
		["/UNC:/server/share/foo\\bar", "\\\\server\\share\\foo_bar"],
		["/DEVICE:/pipe/foo\\bar", "\\\\.\\pipe\\foo_bar"],
		["/DEVICE:/GLOBALROOT/Device/foo\\bar", "\\\\?\\GLOBALROOT\\Device\\foo_bar"],
		["/DEVICE:/Volume{example}/foo\\bar", "\\\\?\\Volume{example}\\foo_bar"],
		["/foo\\bar", "D:\\foo_bar"],
		["DRV-C\\", "DRV-C_"],
		["/DEVICE\\foo", "D:\\DEVICE_foo"],
		["dossier/été-猫.txt", "dossier\\été-猫.txt"],
		["DRV-C:/foo", "C:\\foo"],
		["DRV-C:", "C:"],
		["dir/DRV-C:/foo", "dir\\C:\\foo"],
		["dir/DRV-C:", "dir\\C:"],
		["dir/DRV-c:/DRV-d:/foo", "dir\\C:\\D:\\foo"],
		["dir/prefixDRV-C:/foo", "dir\\prefixDRV-C:\\foo"],
		["dir/DRV-CC:/foo", "dir\\DRV-CC:\\foo"],
		["dir/DRV-C:stream", "dir\\DRV-C:stream"],
		["dir/UNC:/server/share", "dir\\UNC:\\server\\share"],
		["UNC:/server/share", "UNC:\\server\\share"],
		["dir/DEVICE:/pipe/name", "dir\\DEVICE:\\pipe\\name"],
		["C:foo/bar", "C:foo\\bar"],
		["C:", "C:"],
		["file:stream", "file:stream"],
		["file:/foo", "file:\\foo"],
		["/foo", "D:\\foo"],
		["/", "D:\\"],
		["/file:stream", "D:\\file:stream"],
		["/DRV-CC:/foo", "D:\\DRV-CC:\\foo"],
		["/UNC:extra/foo", "D:\\UNC:extra\\foo"],
		["/DEVICE:extra/foo", "D:\\DEVICE:extra\\foo"],
	])("converts %j into %j", (path, expected) => {
		const input = DPath.createOrThrow(path);
		const result = DSPath.toPlatformPath(input);
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);

		type _CheckInput = DCommon.ExpectType<Parameters<typeof DSPath.toPlatformPath>[0], DPath.AnyPath, "strict">;
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string> | DEither.Left<"to-platform-path-error", DPath.AnyPath>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;
	});

	it.each([
		"/UNC:",
		"/UNC:/server",
		"/UNC:/server\\share",
		"/UNC:/?/share",
		"/DEVICE:",
	])("returns the original path when %j cannot be converted", (path) => {
		const input = DPath.createOrThrow(path);
		const result = DSPath.toPlatformPath(input);
		const value = DEither.unwrapByInformationOrThrow(result, "to-platform-path-error");

		expect(value).toBe(input);

		type _CheckValue = DCommon.ExpectType<typeof value, DPath.AnyPath, "strict">;
	});

	it.each([
		["/DRV-C:/foo", "C:\\foo"],
		["/UNC:/server/share", "\\\\server\\share"],
		["/DEVICE:/pipe/name", "\\\\.\\pipe\\name"],
		["/DEVICE:/Volume{example}", "\\\\?\\Volume{example}\\"],
		["/DEVICE:/GLOBALROOT/Device/foo", "\\\\?\\GLOBALROOT\\Device\\foo"],
		["dir/DRV-C:/foo", "dir\\C:\\foo"],
		["DRV-C:/foo", "C:\\foo"],
		["C:foo", "C:foo"],
		["foo/bar", "foo\\bar"],
	])("converts %j without reading cwd", (path, expected) => {
		const directory = vi.fn(() => DEither.left("get-current-work-directory-error", "unavailable"));
		TESTImplementation.set("getCurrentWorkDirectory", directory);

		const result = DSPath.toPlatformPath(DPath.createOrThrow(path));
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);
		expect(directory).not.toHaveBeenCalled();
	});

	describe("current drive", () => {
		it.each([
			["/DRV-C:/project", "/tmp/file.txt", "C:\\tmp\\file.txt"],
			["/DRV-e:/work/nested", "/tmp", "E:\\tmp"],
			["/DRV-D:", "/", "D:\\"],
			["/DRV-C:/project", "/file:stream", "C:\\file:stream"],
		])("uses the drive of %j to convert %j", (directory, path, expected) => {
			const getDirectory = vi.fn(() => DEither.success(DPath.createAbsoluteOrThrow(directory)));
			TESTImplementation.set("getCurrentWorkDirectory", getDirectory);

			const result = DSPath.toPlatformPath(DPath.createOrThrow(path));
			const value = DEither.unwrapByInformationOrThrow(result, "success");

			expect(value).toBe(expected);
			expect(getDirectory).toHaveBeenCalledExactlyOnceWith();
		});

		it("reads cwd again after a drive change", () => {
			const directory = vi.fn()
				.mockReturnValueOnce(DEither.success(DPath.declareAbsolutePath("/DRV-C:/work")))
				.mockReturnValueOnce(DEither.success(DPath.declareAbsolutePath("/DRV-E:/work")));
			TESTImplementation.set("getCurrentWorkDirectory", directory);
			const path = DPath.declareAbsolutePath("/tmp");

			const first = DEither.unwrapByInformationOrThrow(DSPath.toPlatformPath(path), "success");
			const second = DEither.unwrapByInformationOrThrow(DSPath.toPlatformPath(path), "success");

			expect(first).toBe("C:\\tmp");
			expect(second).toBe("E:\\tmp");
			expect(directory).toHaveBeenCalledTimes(2);
		});

		it("returns an error when cwd is unavailable", () => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.left("get-current-work-directory-error", "unavailable"));
			const input = DPath.declareAbsolutePath("/foo");

			const result = DSPath.toPlatformPath(input);

			expect(DEither.unwrapByInformationOrThrow(result, "to-platform-path-error")).toBe(input);
		});

		it.each([
			"/UNC:/server/share",
			"/DEVICE:/Volume{example}",
			"/DEVICE:/GLOBALROOT/Device/foo",
		])("returns an error when cwd %j has no drive letter", (directory) => {
			TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.createAbsoluteOrThrow(directory)));
			const input = DPath.declareAbsolutePath("/foo");

			const result = DSPath.toPlatformPath(input);

			expect(DEither.unwrapByInformationOrThrow(result, "to-platform-path-error")).toBe(input);
		});

		it("uses the normalized system cwd without recursively resolving it", () => {
			setEnvironment("NODE");
			const cwd = vi.spyOn(process, "cwd").mockReturnValue("C:\\work");

			const result = DSPath.toPlatformPath(DPath.declareAbsolutePath("/tmp"));
			const value = DEither.unwrapByInformationOrThrow(result, "success");

			expect(value).toBe("C:\\tmp");
			expect(cwd).toHaveBeenCalledOnce();
		});
	});

	it.each([
		["C:\\foo", "/DRV-C:/foo", "C:\\foo"],
		["c:\\", "/DRV-C:", "C:\\"],
		["\\\\?\\C:\\foo", "/DRV-C:/foo", "C:\\foo"],
		["\\\\?\\UNC\\server\\share", "/UNC:/server/share", "\\\\server\\share"],
		["\\\\server\\share\\foo", "/UNC:/server/share/foo", "\\\\server\\share\\foo"],
		["\\\\.\\pipe\\name", "/DEVICE:/pipe/name", "\\\\.\\pipe\\name"],
		["\\\\.\\C:\\foo", "/DEVICE:/DRV-C:/foo", "\\\\.\\C:\\foo"],
		["\\\\?\\Volume{example}", "/DEVICE:/Volume{example}", "\\\\?\\Volume{example}\\"],
		["\\\\?\\Volume{example}\\foo", "/DEVICE:/Volume{example}/foo", "\\\\?\\Volume{example}\\foo"],
		["\\\\?\\GLOBALROOT\\Device\\HarddiskVolume1\\foo", "/DEVICE:/GLOBALROOT/Device/HarddiskVolume1/foo", "\\\\?\\GLOBALROOT\\Device\\HarddiskVolume1\\foo"],
		["file:///C:/../foo", "/DRV-C:/foo", "C:\\foo"],
		["file://server/share/foo", "/UNC:/server/share/foo", "\\\\server\\share\\foo"],
		["dir\\C:\\foo", "dir/DRV-C:/foo", "dir\\C:\\foo"],
		["..\\foo", "../foo", "..\\foo"],
	])("round-trips %j through %j", (native, normalized, expected) => {
		const path = DSPath.createOrThrow(native);
		const result = DSPath.toPlatformPath(path);
		const platform = DEither.unwrapByInformationOrThrow(result, "success");

		expect(path).toBe(normalized);
		expect(platform).toBe(expected);
		expect(DSPath.normalize(platform)).toBe(path);
	});

	it("converts paths resolved across drive folders", () => {
		const path = DPath.resolveRelative([
			DPath.declareAbsolutePath("/DRV-C:/project"),
			DPath.declarePath("../../DRV-E:/other"),
		]);

		const result = DSPath.toPlatformPath(path);

		expect(DEither.unwrapByInformationOrThrow(result, "success")).toBe("E:\\other");
	});

	it("uses the current drive after traversal removes a namespace folder", () => {
		const path = DPath.resolveRelative([
			DPath.declareAbsolutePath("/DRV-C:"),
			DPath.declarePath(".."),
		]);

		const result = DSPath.toPlatformPath(path);

		expect(path).toBe("/");
		expect(DEither.unwrapByInformationOrThrow(result, "success")).toBe("D:\\");
	});

	it("keeps long paths without adding an extended prefix", () => {
		const name = DString.repeat("a", 300);
		const path = DPath.createAbsoluteOrThrow(`/DRV-C:/${name}`);

		const result = DSPath.toPlatformPath(path);

		expect(DEither.unwrapByInformationOrThrow(result, "success")).toBe(`C:\\${name}`);
	});

	describe("POSIX", () => {
		beforeEach(() => vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.linux));

		it.each([
			"/",
			"/tmp/foo",
			"../foo",
			"/DRV-C:/foo",
			"/UNC:/server/share",
			"/DEVICE:/Volume{example}",
			"/DEVICE:/GLOBALROOT/Device/foo",
			"C:\\foo",
			"foo\\bar",
		])("preserves %j without consulting cwd", (path) => {
			const directory = vi.fn(() => DEither.left("get-current-work-directory-error", "unavailable"));
			TESTImplementation.set("getCurrentWorkDirectory", directory);
			const input = DPath.createOrThrow(path);

			const result = DSPath.toPlatformPath(input);
			const value = DEither.unwrapByInformationOrThrow(result, "success");

			expect(value).toBe(path);
			expect(directory).not.toHaveBeenCalled();
		});
	});
});
