import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("link", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates hard link in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			link: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/existing"), DCommon.infer("/tmp/new"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.link).toHaveBeenCalledWith("/tmp/existing", "/tmp/new");
	});

	it("returns fail when NODE link rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/existing"), DCommon.infer("/tmp/new"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("creates hard link in DENO env", async() => {
		setEnvironment("DENO");
		const link = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ link });

		const result = await DSFile.link(DCommon.infer("/tmp/existing file"), DCommon.infer("/tmp/new file"));

		expect(DEither.isRight(result)).toBe(true);
		expect(link).toHaveBeenCalledWith("/tmp/existing file", "/tmp/new file");
	});

	it("returns fail when DENO link rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			link: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/existing"), DCommon.infer("/tmp/new"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE link rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE link rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE link rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE link rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE link rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE link rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE link rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE link rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE link rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE link rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE link rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns cross-device when NODE link rejects with EXDEV", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EXDEV"),
			{ code: "EXDEV" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-cross-device",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE link rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE link rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO link rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO link rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO link rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO link rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO link rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO link rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO link rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO link rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			link: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.link(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable link signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			link: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.link(DCommon.infer("/tmp/to"));

		const result = await operation(DCommon.infer("/tmp/from"));

		expect(DEither.hasInformation(
			result,
			"file-system-link",
		)).toBe(true);
		expect(fs.link).toHaveBeenCalledWith("/tmp/from", "/tmp/to");
	});
});
