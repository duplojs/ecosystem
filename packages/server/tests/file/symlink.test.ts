import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("symlink", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates symlink in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			symlink: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/old"), DCommon.infer("/tmp/new"), { type: "file" });

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.symlink).toHaveBeenCalledWith("/tmp/old", "/tmp/new", "file");
	});

	it("returns fail when NODE symlink rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/old"), DCommon.infer("/tmp/new"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("creates symlink in DENO env", async() => {
		setEnvironment("DENO");
		const symlink = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ symlink });

		const result = await DSFile.symlink(DCommon.infer("/tmp/old"), DCommon.infer("/tmp/new"), { type: "dir" });

		expect(DEither.isRight(result)).toBe(true);
		expect(symlink).toHaveBeenCalledWith("/tmp/old", "/tmp/new", { type: "dir" });
	});

	it("returns fail when DENO symlink rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/old"), DCommon.infer("/tmp/new"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE symlink rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE symlink rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE symlink rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE symlink rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE symlink rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE symlink rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE symlink rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE symlink rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE symlink rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE symlink rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE symlink rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE symlink rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO symlink rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO symlink rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO symlink rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO symlink rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO symlink rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO symlink rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO symlink rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO symlink rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			symlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.symlink(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable symlink signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			symlink: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.symlink(DCommon.infer("/tmp/to"));

		const result = await operation(DCommon.infer("/tmp/from"));

		expect(DEither.hasInformation(
			result,
			"file-system-symlink",
		)).toBe(true);
		expect(fs.symlink).toHaveBeenCalledWith("/tmp/from", "/tmp/to", undefined);
	});
});
