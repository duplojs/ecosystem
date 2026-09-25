import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("truncate", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("truncates file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			truncate: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.truncate).toHaveBeenCalledWith("/tmp/mock", 10);
	});

	it("returns fail when NODE truncate rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("truncates file in DENO env", async() => {
		setEnvironment("DENO");
		const truncate = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ truncate });

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock file"), 5);

		expect(DEither.isRight(result)).toBe(true);
		expect(truncate).toHaveBeenCalledWith("/tmp/mock file", 5);
	});

	it("truncates URL file path in DENO env", async() => {
		setEnvironment("DENO");
		const truncate = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ truncate });

		const result = await DSFile.truncate(new URL("file:///tmp/mock%20file") as never);

		expect(DEither.isRight(result)).toBe(true);
		expect(truncate).toHaveBeenCalledWith("/tmp/mock file", undefined);
	});

	it("returns fail when DENO truncate rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 5);

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE truncate rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE truncate rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE truncate rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE truncate rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE truncate rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE truncate rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE truncate rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE truncate rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE truncate rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE truncate rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE truncate rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE truncate rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE truncate rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO truncate rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO truncate rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO truncate rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO truncate rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO truncate rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO truncate rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO truncate rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO truncate rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			truncate: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.truncate(DCommon.infer("/tmp/mock"), 10);

		expect(DEither.hasInformation(
			result,
			"file-system-truncate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
