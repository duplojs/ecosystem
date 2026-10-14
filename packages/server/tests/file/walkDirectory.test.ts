import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { expectFileSystemError } from "@tests/_utils/fileSystemError";

type AbsolutePath = string & DPath.Absolute & DPath.Path;
type AbsoluteEntry = (
	| DSFile.FileInterface<string & DPath.Absolute>
	| DSFile.FolderInterface<string & DPath.Absolute>
	| DSFile.UnknownEntryInterface<string & DPath.Absolute>
);

describe("walkDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("walks directory and maps entries", async() => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					parentPath: "/tmp/demo",
					name: "file.json",
					isFile: () => true,
					isDirectory: () => false,
				},
				{
					parentPath: "/tmp/demo",
					name: "sub",
					isFile: () => false,
					isDirectory: () => true,
				},
				{
					parentPath: "/tmp/demo",
					name: "other.zzz",
					isFile: () => false,
					isDirectory: () => false,
				},
			]),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/demo"));
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");
		const items = DArray.from(entries);

		type _Check = DCommon.ExpectType<typeof entries, Generator<AbsoluteEntry>, "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: false,
			withFileTypes: true,
		});
		expect(items[0]?.getName()).toBe("file.json");
		expect((items[0] as DSFile.FileInterface<AbsolutePath>).getMimeType()).toBe("application/json");
		expect(items[1]?.getName()).toBe("sub");
		expect(items[2]?.getName()).toBe("other.zzz");
		expect(DArray.map(items, (entry) => entry.path)).toStrictEqual(["/tmp/demo/file.json", "/tmp/demo/sub", "/tmp/demo/other.zzz"]);
	});

	it("returns fail when NODE readdir rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/demo"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE walkDirectory rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-not-found", error);
	});

	it("returns permission-denied when NODE walkDirectory rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-permission-denied", error);
	});

	it("returns permission-denied when NODE walkDirectory rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-permission-denied", error);
	});

	it("returns not-directory when NODE walkDirectory rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-not-directory", error);
	});

	it("returns too-many-open-files when NODE walkDirectory rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-too-many-open-files", error);
	});

	it("returns too-many-open-files when NODE walkDirectory rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-too-many-open-files", error);
	});

	it("returns busy when NODE walkDirectory rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-busy", error);
	});

	it("returns error when NODE walkDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-error", error);
	});

	it("returns error when NODE walkDirectory rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-walk-directory-error", error);
	});

	it("normalizes absolute paths for every entry kind and preserves their types", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					parentPath: "/tmp//demo/",
					name: "file.txt",
					isFile: () => true,
					isDirectory: () => false,
				},
				{
					parentPath: "/tmp//demo/",
					name: "folder",
					isFile: () => false,
					isDirectory: () => true,
				},
				{
					parentPath: "/tmp//demo/",
					name: "socket",
					isFile: () => false,
					isDirectory: () => false,
				},
			]),
		});
		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/demo"));
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");

		type _Check = DCommon.ExpectType<typeof entries, Generator<AbsoluteEntry>, "strict">;

		const items = DArray.from(entries);
		const paths = DArray.map(items, (entry) => entry.path);

		type _CheckPaths = DCommon.ExpectType<typeof paths, readonly AbsolutePath[], "strict">;

		expect(paths).toStrictEqual(["/tmp/demo/file.txt", "/tmp/demo/folder", "/tmp/demo/socket"]);
		expect(DArray.map(paths, DPath.isAbsolute)).toStrictEqual([true, true, true]);
		expect(DSFile.isFileInterface(items[0])).toBe(true);
		expect(DSFile.isFolderInterface(items[1])).toBe(true);
		expect(DSFile.isUnknownEntryInterface(items[2])).toBe(true);
	});

	it("emits absolute paths for nested entries when recursive is enabled", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					parentPath: "/tmp/demo/nested",
					name: "file.txt",
					isFile: () => true,
					isDirectory: () => false,
				},
				{
					parentPath: "/tmp/demo/nested/deep",
					name: "folder",
					isFile: () => false,
					isDirectory: () => true,
				},
				{
					parentPath: "/tmp/demo/nested/deep",
					name: "socket",
					isFile: () => false,
					isDirectory: () => false,
				},
			]),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/demo"), { recursive: true });
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");
		const items = DArray.from(entries);
		const paths = DArray.map(items, (entry) => entry.path);

		type _CheckEntries = DCommon.ExpectType<typeof entries, Generator<AbsoluteEntry>, "strict">;
		type _CheckPaths = DCommon.ExpectType<typeof paths, readonly AbsolutePath[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: true,
			withFileTypes: true,
		});
		expect(paths).toStrictEqual(["/tmp/demo/nested/file.txt", "/tmp/demo/nested/deep/folder", "/tmp/demo/nested/deep/socket"]);
		expect(DArray.map(paths, DPath.isAbsolute)).toStrictEqual([true, true, true]);
	});

	it("emits absolute paths for every entry kind from a relative input", async() => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					parentPath: "demo",
					name: "file.txt",
					isFile: () => true,
					isDirectory: () => false,
				},
				{
					parentPath: "demo",
					name: "folder",
					isFile: () => false,
					isDirectory: () => true,
				},
				{
					parentPath: "demo",
					name: "socket",
					isFile: () => false,
					isDirectory: () => false,
				},
			]),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("demo"));
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");
		const paths = DArray.map(DArray.from(entries), (entry) => entry.path);

		type _CheckPaths = DCommon.ExpectType<typeof paths, readonly AbsolutePath[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("demo", {
			recursive: false,
			withFileTypes: true,
		});
		expect(paths).toStrictEqual(["/workspace/demo/file.txt", "/workspace/demo/folder", "/workspace/demo/socket"]);
		expect(DArray.map(paths, DPath.isAbsolute)).toStrictEqual([true, true, true]);
	});

	it("returns an empty generator when the directory is empty", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({ readdir: vi.fn().mockResolvedValue([]) });

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/demo"), { recursive: false });
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");

		type _Check = DCommon.ExpectType<typeof entries, Generator<AbsoluteEntry>, "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: false,
			withFileTypes: true,
		});
		expect(DArray.from(entries)).toStrictEqual([]);
	});

	it("supports inherited dirent methods when resolving absolute paths", async() => {
		class FileDirent {
			public readonly name = "file.txt";

			public readonly parentPath = "demo";

			public isFile() {
				return true;
			}

			public isDirectory() {
				return false;
			}
		}

		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		setFsPromisesMock({ readdir: vi.fn().mockResolvedValue([new FileDirent()]) });

		const result = await DSFile.walkDirectory(DCommon.infer("demo"));
		const entries = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory");
		const items = DArray.from(entries);

		expect(DArray.map(items, (entry) => entry.path)).toStrictEqual(["/workspace/demo/file.txt"]);
		expect(DSFile.isFileInterface(items[0])).toBe(true);
	});
});
