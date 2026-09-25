import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

interface DenoFileInfoMock {
	isFile: boolean;
	isDirectory: boolean;
	isSymlink: boolean;
	size: number;
	mtime: Date | null;
	atime: Date | null;
	birthtime: Date | null;
	ctime: Date | null;
	dev: number | null;
	ino: number | null;
	mode: number | null;
	nlink: number | null;
	uid: number | null;
	gid: number | null;
	rdev: number | null;
	blksize: number | null;
	blocks: number | null;
	isBlockDevice: boolean | null;
	isCharDevice: boolean | null;
	isFifo: boolean | null;
	isSocket: boolean | null;
}

function createNodeStatsMock(overrides: Partial<Record<string, unknown>> = {}) {
	const now = new Date("2020-01-01T00:00:00Z");
	return {
		isFile: () => true,
		isDirectory: () => false,
		isSymbolicLink: () => true,
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
		...overrides,
	};
}

function createDenoFileInfoMock(overrides: Partial<DenoFileInfoMock> = {}): DenoFileInfoMock {
	const now = new Date("2020-01-01T00:00:00Z");
	return {
		isFile: true,
		isDirectory: false,
		isSymlink: true,
		size: 321,
		mtime: now,
		atime: now,
		birthtime: now,
		ctime: now,
		dev: 10,
		ino: 20,
		mode: 30,
		nlink: 40,
		uid: 50,
		gid: 60,
		rdev: 70,
		blksize: 80,
		blocks: 90,
		isBlockDevice: false,
		isCharDevice: false,
		isFifo: false,
		isSocket: false,
		...overrides,
	};
}

describe("linkStat", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns link stat info in NODE env", async() => {
		setEnvironment("NODE");
		const stats = createNodeStatsMock({ size: 777 });
		setFsPromisesMock({
			lstat: vi.fn().mockResolvedValue(stats),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).sizeBytes).toBe(777);
		}
	});

	it("returns null timestamps when NODE stats are invalid", async() => {
		setEnvironment("NODE");
		const invalidDate = new Date("invalid");
		const stats = createNodeStatsMock({
			mtime: invalidDate,
			atime: invalidDate,
			birthtime: invalidDate,
			ctime: invalidDate,
		});
		setFsPromisesMock({
			lstat: vi.fn().mockResolvedValue(stats),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			const info = DEither.unwrapRight(result);
			expect(info.modifiedAt).toBe(null);
			expect(info.accessedAt).toBe(null);
			expect(info.createdAt).toBe(null);
			expect(info.changedAt).toBe(null);
		}
	});

	it("returns fail when NODE lstat rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns link stat info in DENO env", async() => {
		setEnvironment("DENO");
		const fileInfo = createDenoFileInfoMock({ size: 888 });
		setDenoMock({
			lstat: vi.fn().mockResolvedValue(fileInfo),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result).sizeBytes).toBe(888);
		}
	});

	it("returns null timestamps when DENO stats are missing", async() => {
		setEnvironment("DENO");
		const fileInfo = createDenoFileInfoMock({
			mtime: null,
			atime: null,
			birthtime: null,
			ctime: null,
		});
		setDenoMock({
			lstat: vi.fn().mockResolvedValue(fileInfo),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			const info = DEither.unwrapRight(result);
			expect(info.modifiedAt).toBe(null);
			expect(info.accessedAt).toBe(null);
			expect(info.createdAt).toBe(null);
			expect(info.changedAt).toBe(null);
		}
	});

	it("returns fail when DENO lstat rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE linkStat rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE linkStat rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE linkStat rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE linkStat rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE linkStat rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE linkStat rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE linkStat rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE linkStat rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE linkStat rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO linkStat rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO linkStat rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO linkStat rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO linkStat rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO linkStat rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO linkStat rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			lstat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.linkStat(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-stat-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
