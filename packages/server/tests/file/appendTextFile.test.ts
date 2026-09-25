import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("appendTextFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("appends text file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			appendFile: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.appendFile).toHaveBeenCalledWith("/tmp/mock", "hello");
	});

	it("returns fail when NODE appendTextFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("appends text file in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			writeTextFile: spy,
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "deno");

		expect(DEither.isRight(result)).toBe(true);
		expect(spy).toHaveBeenCalledWith("/tmp/mock", "deno", { append: true });
	});

	it("returns fail when DENO appendTextFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "deno");

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE appendTextFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE appendTextFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE appendTextFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE appendTextFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE appendTextFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE appendTextFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE appendTextFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE appendTextFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE appendTextFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE appendTextFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE appendTextFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE appendTextFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE appendTextFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO appendTextFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO appendTextFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO appendTextFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO appendTextFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO appendTextFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO appendTextFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO appendTextFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO appendTextFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendTextFile(DCommon.infer("/tmp/mock"), "hello");

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable appendTextFile signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			appendFile: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.appendTextFile("hello");

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-append-text-file",
		)).toBe(true);
		expect(fs.appendFile).toHaveBeenCalledWith("/tmp/mock", "hello");
	});
});
