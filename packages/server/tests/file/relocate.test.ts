import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("relocate", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("relocates entry in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/file.txt"), DCommon.infer("/new/parent"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/file.txt", "/new/parent/file.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/new/parent/file.txt");
		}
	});

	it("returns fail when NODE relocate rejects", async() => {
		setEnvironment("NODE");
		const error = new Error("boom");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/file.txt"), DCommon.infer("/new/parent"));

		expect(DEither.isLeft(result)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns fail when NODE source path has no base name", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.relocate(DCommon.infer("/"), DCommon.infer("/new/parent"));

		expect(DEither.isLeft(result)).toBe(true);
		expect(fs.rename).not.toHaveBeenCalled();
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBeInstanceOf(Error);
		}
	});

	it("relocates entry in DENO env", async() => {
		setEnvironment("DENO");
		const rename = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ rename });

		const result = await DSFile.relocate(DCommon.infer("/tmp/file.txt"), DCommon.infer("/new/parent"));

		expect(DEither.isRight(result)).toBe(true);
		expect(rename).toHaveBeenCalledWith("/tmp/file.txt", "/new/parent/file.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/new/parent/file.txt");
		}
	});

	it("returns fail when DENO relocate rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/file.txt"), DCommon.infer("/new/parent"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail when DENO source path has no base name", async() => {
		setEnvironment("DENO");
		const rename = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ rename });

		const result = await DSFile.relocate(DCommon.infer("/"), DCommon.infer("/new/parent"));

		expect(DEither.isLeft(result)).toBe(true);
		expect(rename).not.toHaveBeenCalled();
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBeInstanceOf(Error);
		}
	});
	it("returns not-found when NODE relocate rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE relocate rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE relocate rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE relocate rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE relocate rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE relocate rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns directory-not-empty when NODE relocate rejects with ENOTEMPTY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTEMPTY"),
			{ code: "ENOTEMPTY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-directory-not-empty",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE relocate rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE relocate rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE relocate rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns cross-device when NODE relocate rejects with EXDEV", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EXDEV"),
			{ code: "EXDEV" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-cross-device",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE relocate rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE relocate rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO relocate rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO relocate rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO relocate rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO relocate rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO relocate rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO relocate rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO relocate rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO relocate rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO relocate rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.relocate(DCommon.infer("/tmp/from.txt"), DCommon.infer("/tmp/parent"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable relocate signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.relocate(DCommon.infer("/tmp/parent"));

		const result = await operation(DCommon.infer("/tmp/from.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-relocate",
		)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/from.txt", "/tmp/parent/from.txt");
	});
});
