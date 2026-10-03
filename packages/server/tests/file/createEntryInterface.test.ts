import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
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

describe("createEntryInterface", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates a file interface", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			stat: vi.fn().mockResolvedValue({
				...createNodeStatsMock(),
				isFile: () => true,
			}),
		});
		const result = await DSFile.createEntryInterface(DCommon.infer("/tmp/file.json"));
		const entry = DEither.unwrapByInformationOrThrow(result, "file-interface");

		type _Check = DCommon.ExpectType<typeof entry, DSFile.FileInterface, "strict">;

		expect(DSFile.isFileInterface(entry)).toBe(true);
		expect(entry.path).toBe("/tmp/file.json");
		expect(fs.stat).toHaveBeenCalledWith("/tmp/file.json");
	});

	it("creates a folder interface", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			stat: vi.fn().mockResolvedValue({
				...createNodeStatsMock(),
				isDirectory: () => true,
			}),
		});
		const result = await DSFile.createEntryInterface(DCommon.infer("/tmp/folder"));
		const entry = DEither.unwrapByInformationOrThrow(result, "folder-interface");

		type _Check = DCommon.ExpectType<typeof entry, DSFile.FolderInterface, "strict">;

		expect(DSFile.isFolderInterface(entry)).toBe(true);
		expect(entry.path).toBe("/tmp/folder");
	});

	it("creates an unknown entry interface for special entries", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({ stat: vi.fn().mockResolvedValue(createNodeStatsMock()) });
		const result = await DSFile.createEntryInterface(DCommon.infer("/tmp/entry"));
		const entry = DEither.unwrapByInformationOrThrow(result, "unknown-entry-interface");

		type _Check = DCommon.ExpectType<typeof entry, DSFile.UnknownEntryInterface, "strict">;

		expect(DSFile.isUnknownEntryInterface(entry)).toBe(true);
		expect(entry.path).toBe("/tmp/entry");
	});

	it.each(["ENOENT", "EACCES", "UNKNOWN"])("wraps the stat error %s", async(code) => {
		setEnvironment("NODE");
		const error = Object.assign(new Error("stat failed"), { code });
		setFsPromisesMock({ stat: vi.fn().mockRejectedValue(error) });
		const result = await DSFile.createEntryInterface(DCommon.infer("/tmp/entry"));

		expect(DEither.unwrapByInformationOrThrow(result, "create-entry-interface-error")).toBe(error);
	});
});
