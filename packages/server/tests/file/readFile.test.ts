import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("readFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("reads file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readFile: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(Array.from(DEither.unwrapRight(result))).toEqual([1, 2, 3]);
		}
	});

	it("returns fail when NODE readFile rejects", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads file in DENO env", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readFile: vi.fn().mockResolvedValue(new Uint8Array([4, 5])),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(Array.from(DEither.unwrapRight(result))).toEqual([4, 5]);
		}
	});

	it("returns fail when DENO readFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads file in BUN env", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				bytes: vi.fn().mockResolvedValue(new Uint8Array([7])),
			}),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(Array.from(DEither.unwrapRight(result))).toEqual([7]);
		}
	});

	it("returns fail when BUN readFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				bytes: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE readFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE readFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE readFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE readFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO readFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO readFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO readFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO readFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO readFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
