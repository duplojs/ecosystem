import { DSCommon, DSFile, setEnvironment } from "@scripts";
import * as DChrono from "@duplojs/lang/chrono";
import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";
import { setOsMock } from "@tests/_utils/os.mock";
import { setCryptoMock } from "@tests/_utils/crypto.mock";

// Cross-API tests complement the per-operation tests: every platform boundary must validate first.
describe("Windows filesystem boundaries", () => {
	const path = DPath.declarePath("/C:/work/file.txt");
	const invalid = DPath.declarePath("/");

	beforeEach(() => {
		vi.stubGlobal("process", {
			...process,
			platform: "win32",
		});
		vi.spyOn(process, "cwd").mockReturnValue("C:\\work");
		setEnvironment("NODE");
	});
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it.each([
		{
			name: "readFile",
			platform: "readFile",
			run: () => DSFile.readFile(invalid),
		},
		{
			name: "readTextFile",
			platform: "readFile",
			run: () => DSFile.readTextFile(invalid),
		},
		{
			name: "readJsonFile",
			platform: "readFile",
			run: () => DSFile.readJsonFile(invalid),
		},
		{
			name: "writeFile",
			platform: "writeFile",
			run: () => DSFile.writeFile(invalid, new Uint8Array()),
		},
		{
			name: "writeTextFile",
			platform: "writeFile",
			run: () => DSFile.writeTextFile(invalid, ""),
		},
		{
			name: "writeJsonFile",
			platform: "writeFile",
			run: () => DSFile.writeJsonFile(invalid, {}),
		},
		{
			name: "appendFile",
			platform: "appendFile",
			run: () => DSFile.appendFile(invalid, new Uint8Array()),
		},
		{
			name: "appendTextFile",
			platform: "appendFile",
			run: () => DSFile.appendTextFile(invalid, ""),
		},
		{
			name: "exists",
			platform: "access",
			run: () => DSFile.exists(invalid),
		},
		{
			name: "stat",
			platform: "stat",
			run: () => DSFile.stat(invalid),
		},
		{
			name: "linkStat",
			platform: "lstat",
			run: () => DSFile.linkStat(invalid),
		},
		{
			name: "realPath",
			platform: "realpath",
			run: () => DSFile.realPath(invalid),
		},
		{
			name: "readLink",
			platform: "readlink",
			run: () => DSFile.readLink(invalid),
		},
		{
			name: "readDirectory",
			platform: "readdir",
			run: () => DSFile.readDirectory(invalid),
		},
		{
			name: "walkDirectory",
			platform: "readdir",
			run: () => DSFile.walkDirectory(invalid),
		},
		{
			name: "ensureFile",
			platform: "open",
			run: () => DSFile.ensureFile(invalid),
		},
		{
			name: "ensureDirectory",
			platform: "mkdir",
			run: () => DSFile.ensureDirectory(invalid),
		},
		{
			name: "makeDirectory",
			platform: "mkdir",
			run: () => DSFile.makeDirectory(invalid),
		},
		{
			name: "remove",
			platform: "rm",
			run: () => DSFile.remove(invalid),
		},
		{
			name: "copy source",
			platform: "cp",
			run: () => DSFile.copy(invalid, path),
		},
		{
			name: "copy destination",
			platform: "cp",
			run: () => DSFile.copy(path, invalid),
		},
		{
			name: "move source",
			platform: "rename",
			run: () => DSFile.move(invalid, path),
		},
		{
			name: "move destination",
			platform: "rename",
			run: () => DSFile.move(path, invalid),
		},
		{
			name: "link source",
			platform: "link",
			run: () => DSFile.link(invalid, path),
		},
		{
			name: "link destination",
			platform: "link",
			run: () => DSFile.link(path, invalid),
		},
		{
			name: "symlink target",
			platform: "symlink",
			run: () => DSFile.symlink(invalid, path, { type: "file" }),
		},
		{
			name: "symlink destination",
			platform: "symlink",
			run: () => DSFile.symlink(path, invalid, { type: "file" }),
		},
		{
			name: "relocate",
			platform: "rename",
			run: () => DSFile.relocate(path, invalid),
		},
		{
			name: "truncate",
			platform: "truncate",
			run: () => DSFile.truncate(invalid, 0),
		},
		{
			name: "setMode",
			platform: "chmod",
			run: () => DSFile.setMode(invalid, {}),
		},
		{
			name: "setOwner",
			platform: "chown",
			run: () => DSFile.setOwner(invalid, {
				userId: 1,
				groupId: 1,
			}),
		},
		{
			name: "setTime",
			platform: "utimes",
			run: () => DSFile.setTime(invalid, {
				accessTime: DChrono.createDateOrThrow(0),
				modifiedTime: DChrono.createDateOrThrow(0),
			}),
		},
	] as const)("rejects $name before platform $platform", async({ platform, run }) => {
		const fs = setFsPromisesMock({ [platform]: vi.fn() });
		const result = await run();
		expect(DEither.isLeft(result)).toBe(true);
		expect(fs[platform]).not.toHaveBeenCalled();
	});

	it("delegates filename validation to the platform API and returns its error", async() => {
		const fs = setFsPromisesMock({ rename: vi.fn().mockRejectedValue(new Error("invalid filename")) });
		const result = await DSFile.rename(path, DCommon.infer("NUL"));

		expect(fs.rename).toHaveBeenCalledWith("C:\\work\\file.txt", "C:\\work\\NUL");
		expect(DEither.isLeft(result)).toBe(true);
	});

	it("converts both paths and preserves cross-device move errors", async() => {
		const fs = setFsPromisesMock({ rename: vi.fn().mockRejectedValue(Object.assign(new Error("cross device"), { code: "EXDEV" })) });
		const result = await DSFile.move(path, DPath.declarePath("/D:/destination"));
		expect(fs.rename).toHaveBeenCalledWith("C:\\work\\file.txt", "D:\\destination");
		expect(DEither.unwrapLeft(result)).toBeInstanceOf(DSFile.MoveErrorCrossDevice);
	});

	it("converts platform directory outputs before returning paths and interfaces", async() => {
		const dirent = {
			name: "été.txt",
			parentPath: "C:\\work\\sub",
			isFile: () => true,
			isDirectory: () => false,
		};
		const fs = setFsPromisesMock({ readdir: vi.fn().mockResolvedValueOnce(["sub\\été.txt"]).mockResolvedValue([dirent]) });
		const relative = DEither.unwrapByInformationOrThrow(await DSFile.readDirectory(DPath.declarePath("/C:/work"), { recursive: true }), "file-system-read-directory");
		expect(relative).toEqual(["sub/été.txt"]);
		const absolute = DEither.unwrapByInformationOrThrow(await DSFile.readDirectory(DPath.declarePath("/C:/work"), { absolute: true }), "file-system-read-directory");
		expect(absolute).toEqual(["/C:/work/sub/été.txt"]);
		const walked = DEither.unwrapByInformationOrThrow(await DSFile.walkDirectory(DPath.declarePath("/C:/work")), "file-system-walk-directory");
		for (const entry of walked) {
			expect(entry.path).toBe("/C:/work/sub/été.txt");
		}
		expect(fs.readdir).toHaveBeenCalledWith("C:\\work", expect.anything());
	});

	it("rejects invalid dirents inside the Either before returning a lazy generator", async() => {
		setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue([
				{
					name: "invalid\0name",
					parentPath: "C:\\work",
				},
			]),
		});
		const result = await DSFile.walkDirectory(DPath.declarePath("/C:/work"));
		expect(DEither.isLeft(result)).toBe(true);
	});

	it.each([
		{
			target: "C:\\target",
			expected: "C:\\target",
		},
		{
			target: "..\\target",
			expected: "..\\target",
		},
		{
			target: "folder\\..\\target",
			expected: "folder\\..\\target",
		},
		{
			target: "\\\\server\\share\\target",
			expected: "\\\\server\\share\\target",
		},
	])("preserves link target text $target", async({ target, expected }) => {
		setFsPromisesMock({ readlink: vi.fn().mockResolvedValue(target) });
		expect(DEither.unwrapByInformationOrThrow(await DSFile.readLink(path), "file-system-read-link")).toBe(expected);
	});

	it("converts platform real paths and temp paths", async() => {
		setOsMock({ tmpdir: vi.fn().mockReturnValue("C:\\Temp") });
		setCryptoMock({ randomUUID: vi.fn().mockReturnValue("uuid") });
		const fs = setFsPromisesMock({
			realpath: vi.fn().mockResolvedValue("C:\\work\\file.txt"),
			open: vi.fn().mockResolvedValue({ close: vi.fn().mockResolvedValue(undefined) }),
			mkdtemp: vi.fn().mockResolvedValue("C:\\Temp\\dir-uuid"),
		});
		expect(DEither.unwrapByInformationOrThrow(await DSFile.realPath(path), "file-system-real-path")).toBe(path);
		expect(DEither.unwrapByInformationOrThrow(await DSFile.makeTemporaryFile(DCommon.infer("file-")), "file-system-make-temporary-file")).toBe("/C:/Temp/file-uuid");
		expect(fs.open).toHaveBeenCalledWith("C:\\Temp\\file-uuid", "wx");
		expect(DEither.unwrapByInformationOrThrow(await DSFile.makeTemporaryDirectory("/C:/Temp/dir-"), "file-system-make-temporary-directory")).toBe("/C:/Temp/dir-uuid");
		expect(fs.mkdtemp).toHaveBeenCalledWith("C:\\Temp\\dir-");
	});

	it("catches invalid temporary paths", async() => {
		setOsMock({ tmpdir: vi.fn().mockReturnValue("\\\\?\\C:\\Temp") });
		const fs = setFsPromisesMock({
			open: vi.fn(),
			mkdtemp: vi.fn(),
		});
		expect(DEither.isLeft(await DSFile.makeTemporaryFile(DCommon.infer("file-")))).toBe(true);
		expect(DEither.isLeft(await DSFile.makeTemporaryDirectory("/"))).toBe(true);
		expect(fs.open).not.toHaveBeenCalled();
		expect(fs.mkdtemp).not.toHaveBeenCalled();
	});

	it("validates Deno and Bun paths before platform operations", async() => {
		setEnvironment("DENO");
		const readFile = vi.fn().mockResolvedValue(new Uint8Array());
		const makeTempFile = vi.fn().mockResolvedValue("C:\\Temp\\a.txt");
		const truncate = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			readFile,
			makeTempFile,
			truncate,
		});
		DEither.unwrapByInformationOrThrow(await DSFile.readFile(path), "file-system-read-file");
		expect(readFile).toHaveBeenCalledWith("C:\\work\\file.txt");
		readFile.mockClear();
		expect(DEither.isLeft(await DSFile.readFile(invalid))).toBe(true);
		expect(readFile).not.toHaveBeenCalled();
		DEither.unwrapByInformationOrThrow(await DSFile.truncate(path, 5), "file-system-truncate");
		expect(truncate).toHaveBeenCalledWith("C:\\work\\file.txt", 5);
		truncate.mockClear();
		const truncateError = DEither.unwrapByInformationOrThrow(await DSFile.truncate(invalid, 5), "file-system-truncate-error");
		expect(truncateError).toBeInstanceOf(DSFile.TruncateError);
		expect(truncate).not.toHaveBeenCalled();
		expect(DEither.unwrapByInformationOrThrow(await DSFile.makeTemporaryFile(DCommon.infer("file-")), "file-system-make-temporary-file")).toBe("/C:/Temp/a.txt");
		makeTempFile.mockRejectedValueOnce(new Error("invalid prefix"));
		expect(DEither.isLeft(await DSFile.makeTemporaryFile(DCommon.infer("NUL:")))).toBe(true);
		expect(makeTempFile).toHaveBeenCalledTimes(2);

		setEnvironment("BUN");
		const file = vi.fn().mockReturnValue({ bytes: () => Promise.resolve(new Uint8Array()) });
		setBunMock({ file });
		DEither.unwrapByInformationOrThrow(await DSFile.readFile(path), "file-system-read-file");
		expect(file).toHaveBeenCalledWith("C:\\work\\file.txt");
		file.mockClear();
		expect(DEither.isLeft(await DSFile.readFile(invalid))).toBe(true);
		expect(file).not.toHaveBeenCalled();
	});

	it.each([
		{
			name: "writeFile",
			data: new Uint8Array([1]),
			run: (input: DPath.AnyPath) => DSFile.writeFile(input, new Uint8Array([1])),
			information: "file-system-write-file",
			errorInformation: "file-system-write-file-error",
			errorClass: DSFile.WriteFileError,
		},
		{
			name: "writeTextFile",
			data: "hello",
			run: (input: DPath.AnyPath) => DSFile.writeTextFile(input, "hello"),
			information: "file-system-write-text-file",
			errorInformation: "file-system-write-text-file-error",
			errorClass: DSFile.WriteTextFileError,
		},
	] as const)("converts and validates Windows paths for Bun $name", async({ data, run, information, errorInformation, errorClass }) => {
		setEnvironment("BUN");
		const write = vi.fn().mockResolvedValue(undefined);
		const file = vi.fn().mockReturnValue({ write });
		setBunMock({ file });

		DEither.unwrapByInformationOrThrow(await run(path), information);
		expect(file).toHaveBeenCalledWith("C:\\work\\file.txt");
		expect(write).toHaveBeenCalledWith(data);

		file.mockClear();
		write.mockClear();
		const error = DEither.unwrapByInformationOrThrow(await run(invalid), errorInformation);
		expect(error).toBeInstanceOf(errorClass);
		expect(file).not.toHaveBeenCalled();
		expect(write).not.toHaveBeenCalled();
	});

	it("converts cwd and import.meta.dirname", () => {
		vi.spyOn(process, "cwd").mockReturnValue("C:\\work");
		expect(DSCommon.getCurrentWorkDirectoryOrThrow()).toBe("/C:/work");
		expect(DSCommon.getCurrentDirectoryName({ dirname: "C:\\module" } as ImportMeta)).toBe("/C:/module");
		const chdir = vi.spyOn(process, "chdir").mockImplementation(() => undefined);
		expect(DEither.isRight(DSCommon.setCurrentWorkingDirectory(DPath.createAbsoluteOrThrow("/D:/work")))).toBe(true);
		expect(chdir).toHaveBeenCalledWith("D:\\work");
		chdir.mockClear();
		expect(DEither.isLeft(DSCommon.setCurrentWorkingDirectory(DPath.createAbsoluteOrThrow("/")))).toBe(true);
		expect(chdir).not.toHaveBeenCalled();
	});
});
