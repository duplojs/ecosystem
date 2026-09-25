import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("writeTextFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("writes text file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith("/tmp/mock", "hello", { encoding: "utf-8" });
	});

	it("returns fail when NODE writeTextFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes text file in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			writeTextFile: spy,
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "deno");

		expect(DEither.isRight(result)).toBe(true);
		expect(spy).toHaveBeenCalledWith("/tmp/mock", "deno");
	});

	it("returns fail when DENO writeTextFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "deno");

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes text file in BUN env", async() => {
		setEnvironment("BUN");
		const writeSpy = vi.fn().mockResolvedValue(undefined);
		setBunMock({
			file: vi.fn().mockReturnValue({ write: writeSpy }),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "bun");

		expect(DEither.isRight(result)).toBe(true);
		expect(writeSpy).toHaveBeenCalledWith("bun");
	});

	it("returns fail when BUN writeTextFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				write: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "bun");

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE writeTextFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeTextFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeTextFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE writeTextFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE writeTextFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE writeTextFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE writeTextFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE writeTextFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeTextFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeTextFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE writeTextFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeTextFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeTextFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO writeTextFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeTextFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeTextFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO writeTextFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO writeTextFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO writeTextFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO writeTextFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO writeTextFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable writeTextFile signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.writeTextFile("hello");

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-write-text-file",
		)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith("/tmp/mock", "hello", { encoding: "utf-8" });
	});
});
