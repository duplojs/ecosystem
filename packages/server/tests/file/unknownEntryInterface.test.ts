import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";

function createNodeStatsMock() {
	const now = new Date("2020-01-01T00:00:00Z");
	return {
		isFile: () => false,
		isDirectory: () => false,
		isSymbolicLink: () => false,
		size: 789,
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

describe("unknownEntryInterface", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("detects unknown interface with predicate", () => {
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.json"));
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		const input = unknown as typeof unknown | typeof file | typeof folder;

		if (DSFile.isUnknownEntryInterface(input)) {
			type _Check = DCommon.ExpectType<typeof input, typeof unknown, "strict">;
		}

		expect(DSFile.isUnknownEntryInterface(unknown)).toBe(true);
		expect(DSFile.isUnknownEntryInterface(file)).toBe(false);
		expect(DSFile.isUnknownEntryInterface(folder)).toBe(false);
		expect(DSFile.isUnknownEntryInterface({})).toBe(false);
	});

	it("creates interface with name and parent path", () => {
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/unknown path"));

		expect(unknown.getName()).toBe("unknown path");
		expect(unknown.path).toBe("/tmp/unknown path");
		expect(unknown.getParentPath()).toBe("/tmp");
	});

	it("returns current directory as parent path when no separator is present", () => {
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("file"));

		expect(unknown.getName()).toBe("file");
		expect(unknown.getParentPath()).toBe(".");
	});

	it("checks existence via fs access", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			access: vi.fn().mockResolvedValue(undefined),
		});
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/unknown"));

		const result = await unknown.exist();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.access).toHaveBeenCalledWith("/tmp/unknown");
	});

	it("reads stat info via fs stat", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue(createNodeStatsMock()),
		});
		const unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/unknown"));

		const result = await unknown.stat();

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.stat).toHaveBeenCalledWith("/tmp/unknown");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).sizeBytes).toBe(789);
		}
	});

	it("narrows an unknown input with isUnknownEntryInterfaceFromUnknown", () => {
		const input: unknown = DSFile.createUnknownEntryInterface(DPath.declarePath("/tmp/entry"));
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file.txt"));
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/demo"));
		expect(DSFile.isUnknownEntryInterfaceFromUnknown(input)).toBe(true);
		if (DSFile.isUnknownEntryInterfaceFromUnknown(input)) {
			type _Check = DCommon.ExpectType<typeof input, DSFile.UnknownEntryInterface, "strict">;

			expect(input.path).toBe("/tmp/entry");
		}

		expect(DSFile.isUnknownEntryInterfaceFromUnknown(file)).toBe(false);
		expect(DSFile.isUnknownEntryInterfaceFromUnknown(folder)).toBe(false);
		expect(DSFile.isUnknownEntryInterfaceFromUnknown({})).toBe(false);
		expect(DSFile.isUnknownEntryInterfaceFromUnknown(null)).toBe(false);
	});
});
