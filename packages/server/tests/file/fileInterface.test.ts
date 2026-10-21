import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";

function createNodeStatsMock() {
	const now = new Date("2020-01-01T00:00:00Z");
	return {
		isFile: () => true,
		isDirectory: () => false,
		isSymbolicLink: () => false,
		size: 123,
		mtime: now,
		atime: now,
		birthtime: now,
		ctime: now,
		dev: 1,
		ino: 2,
		mode: 3,
		nlink: 4,
		uid: 5,
		gid: 6,
		rdev: 7,
		blksize: 8,
		blocks: 9,
		isBlockDevice: () => false,
		isCharacterDevice: () => false,
		isFIFO: () => false,
		isSocket: () => false,
	};
}

describe("fileInterface", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("detects file interface with predicate", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));

		const input = file as typeof file | typeof folder | typeof unknown;

		if (DSFile.isFileInterface(input)) {
			type check = DCommon.ExpectType<
				typeof input,
				typeof file,
				"strict"
			>;
		}

		expect(DSFile.isFileInterface(file)).toBe(true);
		expect(DSFile.isFileInterface(folder)).toBe(false);
		expect(DSFile.isFileInterface(unknown)).toBe(false);
		expect(DSFile.isFileInterface({})).toBe(false);
	});

	it("narrows an unknown input with isFileInterfaceFromUnknown", () => {
		const input: unknown = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));

		expect(DSFile.isFileInterfaceFromUnknown(input)).toBe(true);
		if (DSFile.isFileInterfaceFromUnknown(input)) {
			type _Check = DCommon.ExpectType<typeof input, DSFile.FileInterface, "strict">;

			expect(input.path).toBe("/tmp/example.json");
		}

		expect(DSFile.isFileInterfaceFromUnknown(folder)).toBe(false);
		expect(DSFile.isFileInterfaceFromUnknown(unknown)).toBe(false);
		expect(DSFile.isFileInterfaceFromUnknown({})).toBe(false);
		expect(DSFile.isFileInterfaceFromUnknown(null)).toBe(false);
	});

	it("creates interface with name and mime info", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		expect(file.getName()).toBe("example.json");
		expect(file.getExtension()).toBe("json");
		expect(file.getMimeType()).toBe("application/json");
		expect(file.getParentPath()).toBe("/tmp");
	});

	it("creates interface with unknown extension", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/unknown file.zzz"));

		expect(file.path).toBe("/tmp/unknown file.zzz");
		expect(file.getExtension()).toBe("zzz");
		expect(file.getMimeType()).toBe(null);
	});

	it("returns null mime type when no extension exists", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file"));

		expect(file.getExtension()).toBe(null);
		expect(file.getMimeType()).toBe(null);
	});

	it("returns current directory as parent path when no separator is present", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("file"));

		expect(file.getName()).toBe("file");
		expect(file.getParentPath()).toBe(".");
	});

	it("renames file and returns new interface", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.rename(DCommon.infer("next.json"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/example.json", "/tmp/next.json");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/tmp/next.json");
		}
	});

	it("checks existence via fs access", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			access: vi.fn().mockResolvedValue(undefined),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.exists();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.access).toHaveBeenCalledWith("/tmp/example.json");
	});

	it("removes file via fs rm", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rm: vi.fn().mockResolvedValue(undefined),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.remove();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rm).toHaveBeenCalledWith("/tmp/example.json", {
			recursive: false,
			force: true,
		});
	});

	it("reads stat info via fs stat", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue(createNodeStatsMock()),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.stat();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.stat).toHaveBeenCalledWith("/tmp/example.json");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).sizeBytes).toBe(123);
		}
	});

	it("relocates file using move", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.relocate(DCommon.infer("/new/parent"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/example.json", "/new/parent/example.json");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/new/parent/example.json");
		}
	});

	it("moves file to new path", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));

		const result = await file.move(DCommon.infer("/new/path/example.json"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/example.json", "/new/path/example.json");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/new/path/example.json");
		}
	});

	it("getExtension name with dot", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file.txt"));

		expect(file.getExtension()).toBe("txt");
		expect(file.getExtension({ withDot: true })).toBe(".txt");
	});

	it.each([true, false])("isFile returns the stat flag %s", async(expected) => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue({
				...createNodeStatsMock(),
				isFile: () => expected,
			}),
		});
		const entry = DSFile.createFileInterface(DPath.declarePath("/tmp/entry"));
		const result = entry.isFile();

		type _Check = DCommon.ExpectType<typeof result, Promise<boolean>, "strict">;

		expect(await result).toBe(expected);
		expect(fs.stat).toHaveBeenCalledWith("/tmp/entry");
	});

	it("isFile returns false when stat fails", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			stat: vi.fn().mockRejectedValue(new Error("stat failed")),
		});

		expect(await DSFile.createFileInterface(DPath.declarePath("/tmp/entry")).isFile()).toBe(false);
	});

	it("keeps the parent relative when only the path constraint is known", () => {
		const path: string & DPath.Path = DCommon.infer("alpha/entry");
		const entry = DSFile.createFileInterface(path);
		const result = entry.getParentPath();

		expect(result).toBe("alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});

	it.each([
		{
			input: "/alpha/entry",
			expected: "/alpha",
		},
		{
			input: "/entry",
			expected: "/",
		},
		{
			input: "/",
			expected: null,
		},
	] as const)("preserves an absolute-only parent constraint for $input", ({ input, expected }) => {
		const path: string & DPath.Absolute = DCommon.infer(input);
		const entry = DSFile.createFileInterface(path);
		const result = entry.getParentPath();

		expect(entry.path).toBe(input);
		expect(result).toBe(expected);

		type _CheckPath = DCommon.ExpectType<typeof entry.path, string & DPath.Absolute & DPath.Path, "strict">;
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path & DPath.Absolute) | null,
			"strict"
		>;
	});

	it("preserves the absolute parent constraint when both path constraints are known", () => {
		const path: string & DPath.Path & DPath.Absolute = DCommon.infer("/alpha/entry");
		const entry = DSFile.createFileInterface(path);
		const result = entry.getParentPath();

		expect(result).toBe("/alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path & DPath.Absolute) | null,
			"strict"
		>;
	});

	it("does not guarantee an absolute parent for the default entry path type", () => {
		const path: DSFile.EntryPath = DCommon.infer("alpha/entry");
		const entry = DSFile.createFileInterface(path);
		const result = entry.getParentPath();

		expect(result).toBe("alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});

	it("requires a path or absolute constraint instead of a segment alone", () => {
		const segment: string & DPath.Segment = DCommon.infer("entry");

		// @ts-expect-error a segment alone does not satisfy EntryPath.
		DSFile.createFileInterface(segment);
		// @ts-expect-error an unvalidated string does not satisfy EntryPath.
		DSFile.createFileInterface("alpha/entry");
	});
});
