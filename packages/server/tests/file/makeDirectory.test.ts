import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("makeDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates directory in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			mkdir: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"), { recursive: true });

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.mkdir).toHaveBeenCalledWith("/tmp/mock", { recursive: true });
	});

	it("returns fail when NODE mkdir rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("creates directory in DENO env", async() => {
		setEnvironment("DENO");
		const mkdir = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ mkdir });

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"), { recursive: false });

		expect(DEither.isRight(result)).toBe(true);
		expect(mkdir).toHaveBeenCalledWith("/tmp/mock", { recursive: false });
	});

	it("returns fail when DENO mkdir rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE makeDirectory rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE makeDirectory rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE makeDirectory rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE makeDirectory rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE makeDirectory rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE makeDirectory rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE makeDirectory rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE makeDirectory rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeDirectory rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeDirectory rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE makeDirectory rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeDirectory rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO makeDirectory rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeDirectory rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeDirectory rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO makeDirectory rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO makeDirectory rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO makeDirectory rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO makeDirectory rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO makeDirectory rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			mkdir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeDirectory(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
