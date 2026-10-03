import * as DEither from "@duplojs/lang/either";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";

describe("walkDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("walks directory and maps entries", async() => {
		setEnvironment("NODE");
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

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: false,
			withFileTypes: true,
		});
		if (DEither.isRight(result)) {
			const items = DArray.from(DEither.unwrapRight(result));
			expect(items[0]?.getName()).toBe("file.json");
			expect((items[0] as DSFile.FileInterface).getMimeType()).toBe("application/json");
			expect(items[1]?.getName()).toBe("sub");
			expect(items[2]?.getName()).toBe("other.zzz");
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE walkDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.walkDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-walk-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("normalizes paths for every entry kind and preserves their types", async() => {
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

		type _Check = DCommon.ExpectType<typeof entries, Generator<DSFile.FileInterface | DSFile.FolderInterface | DSFile.UnknownEntryInterface>, "strict">;

		const items = Array.from(entries);
		expect(items.map((entry) => entry.path)).toEqual(["/tmp/demo/file.txt", "/tmp/demo/folder", "/tmp/demo/socket"]);
		expect(DSFile.isFileInterface(items[0])).toBe(true);
		expect(DSFile.isFolderInterface(items[1])).toBe(true);
		expect(DSFile.isUnknownEntryInterface(items[2])).toBe(true);
	});
});
