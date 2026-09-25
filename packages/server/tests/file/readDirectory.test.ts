import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";

describe("readDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("reads directory in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readdir: vi.fn().mockResolvedValue(["a", "b"]),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"), { recursive: true });

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.readdir).toHaveBeenCalledWith("/tmp/mock", { recursive: true });
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toEqual(["a", "b"]);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
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

		expect(DEither.hasInformation(
			result,
			"file-system-read-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
