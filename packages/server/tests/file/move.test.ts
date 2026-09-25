import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("move", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("moves entry in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/from", "/tmp/to");
	});

	it("returns fail when NODE move rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("moves entry in DENO env", async() => {
		setEnvironment("DENO");
		const rename = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ rename });

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isRight(result)).toBe(true);
		expect(rename).toHaveBeenCalledWith("/tmp/from", "/tmp/to");
	});

	it("returns fail when DENO move rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE move rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE move rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE move rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE move rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE move rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE move rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns directory-not-empty when NODE move rejects with ENOTEMPTY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTEMPTY"),
			{ code: "ENOTEMPTY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-directory-not-empty",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE move rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE move rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE move rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns cross-device when NODE move rejects with EXDEV", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EXDEV"),
			{ code: "EXDEV" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-cross-device",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE move rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE move rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO move rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO move rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO move rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO move rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO move rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO move rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO move rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO move rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO move rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.move(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-move-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable move signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.move(DCommon.infer("/tmp/to"));

		const result = await operation(DCommon.infer("/tmp/from"));

		expect(DEither.hasInformation(
			result,
			"file-system-move",
		)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/from", "/tmp/to");
	});
});
