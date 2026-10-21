import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import * as DPath from "@duplojs/lang/path";

function createNodeStatsMock() {
	const now = new Date("2020-01-01T00:00:00Z");
	return {
		isFile: () => false,
		isDirectory: () => true,
		isSymbolicLink: () => false,
		size: 456,
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

describe("folderInterface", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("detects folder interface with predicate", () => {
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));

		const input = folder as typeof folder | typeof file | typeof unknown;

		if (DSFile.isFolderInterface(input)) {
			type check = DCommon.ExpectType<
				typeof input,
				typeof folder,
				"strict"
			>;
		}

		expect(DSFile.isFolderInterface(folder)).toBe(true);
		expect(DSFile.isFolderInterface(file)).toBe(false);
		expect(DSFile.isFolderInterface(unknown)).toBe(false);
		expect(DSFile.isFolderInterface({})).toBe(false);
	});

	it("narrows an unknown input with isFolderInterfaceFromUnknown", () => {
		const input: unknown = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file.txt"));
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));

		expect(DSFile.isFolderInterfaceFromUnknown(input)).toBe(true);
		if (DSFile.isFolderInterfaceFromUnknown(input)) {
			type _Check = DCommon.ExpectType<typeof input, DSFile.FolderInterface, "strict">;

			expect(input.path).toBe("/tmp/demo");
		}

		expect(DSFile.isFolderInterfaceFromUnknown(file)).toBe(false);
		expect(DSFile.isFolderInterfaceFromUnknown(unknown)).toBe(false);
		expect(DSFile.isFolderInterfaceFromUnknown({})).toBe(false);
		expect(DSFile.isFolderInterfaceFromUnknown(null)).toBe(false);
	});

	it("creates interface with name and parent path", () => {
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		expect(folder.getName()).toBe("demo");
		expect(folder.path).toBe("/tmp/demo");
		expect(folder.getParentPath()).toBe("/tmp");
	});

	it("returns current directory as parent path when no separator is present", () => {
		const folder = DSFile.createFolderInterface(DPath.declarePath("folder"));

		expect(folder.getName()).toBe("folder");
		expect(folder.getParentPath()).toBe(".");
	});

	it("renames folder and returns new interface", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.rename(DCommon.infer("next"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/demo", "/tmp/next");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/tmp/next");
		}
	});

	it("relocates folder using move", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.relocate(DCommon.infer("/new/parent"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/demo", "/new/parent/demo");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/new/parent/demo");
		}
	});

	it("moves folder to new path", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.move(DCommon.infer("/new/path/demo"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/demo", "/new/path/demo");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).path).toBe("/new/path/demo");
		}
	});

	it("checks existence via fs access", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			access: vi.fn().mockResolvedValue(undefined),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.exists();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.access).toHaveBeenCalledWith("/tmp/demo");
	});

	it("removes folder", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rm: vi.fn().mockResolvedValue(undefined),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.remove();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rm).toHaveBeenCalledWith("/tmp/demo", {
			recursive: false,
			force: true,
		});
	});

	it("reads children via readDirectory", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "b"]),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.getChildren();
		const paths = DEither.unwrapByInformationOrThrow(result, "file-system-read-directory");

		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: undefined,
		});
		expect(paths).toStrictEqual(["a", "b"]);
	});

	it("reads stat info via fs stat", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue(createNodeStatsMock()),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.stat();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.stat).toHaveBeenCalledWith("/tmp/demo");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).sizeBytes).toBe(456);
		}
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
			]),
		});
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));

		const result = await folder.walk();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive: false,
			withFileTypes: true,
		});
		if (DEither.isRight(result)) {
			const items = Array.from(DEither.unwrapRight(result));
			expect(items[0]?.getName()).toBe("file.json");
		}
	});

	it.each([true, false])("isFolder returns the stat flag %s", async(expected) => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue({
				...createNodeStatsMock(),
				isDirectory: () => expected,
			}),
		});
		const entry = DSFile.createFolderInterface(DPath.declarePath("/tmp/entry"));
		const result = entry.isFolder();

		type _Check = DCommon.ExpectType<typeof result, Promise<boolean>, "strict">;

		expect(await result).toBe(expected);
		expect(fs.stat).toHaveBeenCalledWith("/tmp/entry");
	});

	it("isFolder returns false when stat fails", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			stat: vi.fn().mockRejectedValue(new Error("stat failed")),
		});

		expect(await DSFile.createFolderInterface(DPath.declarePath("/tmp/entry")).isFolder()).toBe(false);
	});

	it.each([true, false])("forwards recursive: %s to walkDirectory", async(recursive) => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({ readdir: vi.fn().mockResolvedValue([]) });
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const result = folder.walk({ recursive });

		type _Check = DCommon.ExpectType<typeof result, Promise<DSFile.WalkDirectoryResult>, "strict">;

		expect(Array.from(DEither.unwrapByInformationOrThrow(await result, "file-system-walk-directory"))).toEqual([]);
		expect(fs.readdir).toHaveBeenCalledWith("/tmp/demo", {
			recursive,
			withFileTypes: true,
		});
	});

	it("keeps the parent relative when only the path constraint is known", () => {
		const path: string & DPath.Path = DCommon.infer("alpha/entry");
		const entry = DSFile.createFolderInterface(path);
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
		const entry = DSFile.createFolderInterface(path);
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
		const entry = DSFile.createFolderInterface(path);
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
		const entry = DSFile.createFolderInterface(path);
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
		DSFile.createFolderInterface(segment);
		// @ts-expect-error an unvalidated string does not satisfy EntryPath.
		DSFile.createFolderInterface("alpha/entry");
	});
});
