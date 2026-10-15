import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { expectFileSystemError } from "@tests/_utils/fileSystemError";

describe("readDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();
	});

	it("preserves relative paths by default with recursive entries in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "nested/b"]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"), { recursive: true });
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", {
			recursive: true,
		});
		expect(paths).toStrictEqual(["a", "nested/b"]);
	});

	it("returns relative paths when params are omitted", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "b"]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", {
			recursive: undefined,
		});
		expect(paths).toStrictEqual(["a", "b"]);
	});

	it("returns names without recursion with absolute disabled", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "b"]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"), {
			recursive: false,
			absolute: false,
		});
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", { recursive: false });
		expect(paths).toStrictEqual(["a", "b"]);
	});

	it("normalizes relative paths with recursion and absolute disabled", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "nested//b", "nested/deep/c"]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"), {
			recursive: true,
			absolute: false,
		});
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", { recursive: true });
		expect(paths).toStrictEqual(["a", "nested/b", "nested/deep/c"]);
	});

	it("returns normalized paths using each parentPath with absolute enabled", async() => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					name: "a",
					parentPath: "/tmp//mock/",
				},
				{
					name: "b",
					parentPath: "/tmp//mock/nested/",
				},
			]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"), {
			recursive: true,
			absolute: true,
		});
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path & DPath.Absolute)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", {
			recursive: true,
			withFileTypes: true,
		});
		expect(paths).toStrictEqual(["/tmp/mock/a", "/tmp/mock/nested/b"]);
	});

	it("resolves relative parent paths from the current directory with absolute enabled", async() => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					name: "a",
					parentPath: "mock",
				},
				{
					name: "b",
					parentPath: "mock/nested",
				},
			]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("mock"), {
			recursive: true,
			absolute: true,
		});
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path & DPath.Absolute)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("mock", {
			recursive: true,
			withFileTypes: true,
		});
		expect(paths).toStrictEqual(["/workspace/mock/a", "/workspace/mock/nested/b"]);
	});

	it("infers absolute paths from a separately declared literal params object", async() => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					name: "a",
					parentPath: "mock",
				},
			]),
		});
		const params = { absolute: true } as const;

		const result = await DSFile.readDirectory(DCommon.infer("mock"), params);
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path & DPath.Absolute)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("mock", {
			recursive: undefined,
			withFileTypes: true,
		});
		expect(paths).toStrictEqual(["/workspace/mock/a"]);
	});

	it.each([
		{
			absolute: true,
			entries: [
				{
					name: "a",
					parentPath: "mock",
				},
			],
			expected: ["/workspace/mock/a"],
			expectedOptions: {
				recursive: undefined,
				withFileTypes: true,
			},
		},
		{
			absolute: false,
			entries: ["a"],
			expected: ["a"],
			expectedOptions: { recursive: undefined },
		},
	])("does not guarantee absolute paths for a boolean option ($absolute)", async({ absolute, entries, expected, expectedOptions }) => {
		setEnvironment("NODE");
		vi.spyOn(process, "cwd").mockReturnValue("/workspace");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(entries),
		});

		const result = await DSFile.readDirectory(DCommon.infer("mock"), { absolute });
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(fs.readdir).toHaveBeenCalledWith("mock", expectedOptions);
		expect(paths).toStrictEqual(expected);
	});

	it("does not guarantee absolute paths for an optional true option", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a"]),
		});
		const params: { absolute?: true } = {};

		const result = await DSFile.readDirectory(DCommon.infer("mock"), params);
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		type _Check = DCommon.ExpectType<typeof paths, readonly (string & DPath.Path)[], "strict">;

		expect(paths).toStrictEqual(["a"]);
	});

	it("returns an empty array for an empty directory", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		expect(paths).toStrictEqual([]);
	});

	it("returns fail when NODE readdir rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE readDirectory rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-not-found", error);
	});

	it("returns permission-denied when NODE readDirectory rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-permission-denied", error);
	});

	it("returns permission-denied when NODE readDirectory rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-permission-denied", error);
	});

	it("returns not-directory when NODE readDirectory rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-not-directory", error);
	});

	it("returns too-many-open-files when NODE readDirectory rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-too-many-open-files", error);
	});

	it("returns too-many-open-files when NODE readDirectory rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-too-many-open-files", error);
	});

	it("returns busy when NODE readDirectory rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-busy", error);
	});

	it("returns error when NODE readDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-error", error);
	});

	it("returns error when NODE readDirectory rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-directory-error", error);
	});
});
