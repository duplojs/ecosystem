import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("appendFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("appends file in NODE env", async() => {
		setEnvironment("NODE");
		const data = new Uint8Array([1]);
		const fs = setFsPromisesMock({
			appendFile: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), data);

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.appendFile).toHaveBeenCalledWith("/tmp/mock", data);
	});

	it("returns fail when NODE appendFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([2]));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("appends file in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			writeFile: spy,
		});

		const data = new Uint8Array([3]);
		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), data);

		expect(DEither.isRight(result)).toBe(true);
		expect(spy).toHaveBeenCalledWith("/tmp/mock", data, { append: true });
	});

	it("returns fail when DENO appendFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([4]));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE appendFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE appendFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE appendFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE appendFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE appendFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE appendFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE appendFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE appendFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE appendFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE appendFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE appendFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE appendFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE appendFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			appendFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO appendFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO appendFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO appendFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO appendFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO appendFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO appendFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO appendFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO appendFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.appendFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable appendFile signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			appendFile: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.appendFile(new Uint8Array([1]));

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-append-file",
		)).toBe(true);
		expect(fs.appendFile).toHaveBeenCalledWith("/tmp/mock", new Uint8Array([1]));
	});
});
