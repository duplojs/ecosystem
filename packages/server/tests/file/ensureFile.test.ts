import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("ensureFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("ensures file in NODE env", async() => {
		setEnvironment("NODE");
		const close = vi.fn().mockResolvedValue(undefined);
		const fs = setFsPromisesMock({
			open: vi.fn().mockResolvedValue({ close }),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.open).toHaveBeenCalledWith("/tmp/mock", "a");
		expect(close).toHaveBeenCalled();
	});

	it("returns fail when NODE ensureFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("ensures file in DENO env", async() => {
		setEnvironment("DENO");
		const close = vi.fn();
		const open = vi.fn().mockResolvedValue({ close });
		setDenoMock({ open });

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		expect(open).toHaveBeenCalledWith("/tmp/mock", {
			write: true,
			create: true,
			append: true,
		});
		expect(close).toHaveBeenCalled();
	});

	it("returns fail when DENO ensureFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			open: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns permission-denied when NODE ensureFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE ensureFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE ensureFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE ensureFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE ensureFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE ensureFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE ensureFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE ensureFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE ensureFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE ensureFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE ensureFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE ensureFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO ensureFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO ensureFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO ensureFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO ensureFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO ensureFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO ensureFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO ensureFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
