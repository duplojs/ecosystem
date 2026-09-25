import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("setMode", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("sets mode in NODE env with mode object", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chmod: vi.fn().mockResolvedValue(undefined),
		});

		const mode = {
			user: {
				read: true,
				write: true,
				exec: true,
			},
			group: { read: true },
			other: {
				read: true,
				exec: true,
			},
			setUserId: true,
			sticky: true,
		};

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), mode);

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.chmod).toHaveBeenCalledWith("/tmp/mock", 3045);
	});

	it("returns fail when NODE setMode rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o755);

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("sets mode in NODE env with empty mode object", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chmod: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), {});

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.chmod).toHaveBeenCalledWith("/tmp/mock", 0);
	});

	it("sets mode in NODE env with group special bit and no read permission", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chmod: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), {
			group: { write: true },
			setGroupId: true,
		});

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.chmod).toHaveBeenCalledWith("/tmp/mock", 1040);
	});

	it("sets mode in DENO env with numeric mode", async() => {
		setEnvironment("DENO");
		const chmod = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ chmod });

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.isRight(result)).toBe(true);
		expect(chmod).toHaveBeenCalledWith("/tmp/mock", 0o644);
	});

	it("returns fail when DENO setMode rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE setMode rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setMode rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setMode rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE setMode rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE setMode rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE setMode rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setMode rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setMode rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO setMode rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setMode rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setMode rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO setMode rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO setMode rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO setMode rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			chmod: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setMode(DCommon.infer("/tmp/mock"), 0o644);

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable setMode signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chmod: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.setMode(0o644);

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-set-mode",
		)).toBe(true);
		expect(fs.chmod).toHaveBeenCalledWith("/tmp/mock", 0o644);
	});
});
