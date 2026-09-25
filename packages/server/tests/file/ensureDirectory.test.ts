import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("ensureDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("ensures directory in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			mkdir: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.mkdir).toHaveBeenCalledWith("/tmp/mock", { recursive: true });
	});

	it("returns fail when NODE ensureDirectory rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("ensures directory in DENO env", async() => {
		setEnvironment("DENO");
		const mkdir = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ mkdir });

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		expect(mkdir).toHaveBeenCalledWith("/tmp/mock", { recursive: true });
	});

	it("returns fail when DENO ensureDirectory rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns permission-denied when NODE ensureDirectory rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE ensureDirectory rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE ensureDirectory rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE ensureDirectory rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE ensureDirectory rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE ensureDirectory rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE ensureDirectory rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE ensureDirectory rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE ensureDirectory rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE ensureDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE ensureDirectory rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO ensureDirectory rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO ensureDirectory rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO ensureDirectory rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO ensureDirectory rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO ensureDirectory rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO ensureDirectory rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.ensureDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-ensure-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
