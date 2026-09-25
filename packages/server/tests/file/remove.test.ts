import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("remove", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("removes entry in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rm: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"), { recursive: true });

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rm).toHaveBeenCalledWith("/tmp/mock", {
			recursive: true,
			force: true,
		});
	});

	it("returns fail when NODE remove rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("removes entry in DENO env", async() => {
		setEnvironment("DENO");
		const remove = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ remove });

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"), { recursive: false });

		expect(DEither.isRight(result)).toBe(true);
		expect(remove).toHaveBeenCalledWith("/tmp/mock", { recursive: false });
	});

	it("returns fail when DENO remove rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE remove rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE remove rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE remove rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE remove rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE remove rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns directory-not-empty when NODE remove rejects with ENOTEMPTY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTEMPTY"),
			{ code: "ENOTEMPTY" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-directory-not-empty",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE remove rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE remove rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE remove rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE remove rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE remove rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			rm: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO remove rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO remove rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO remove rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO remove rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO remove rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO remove rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO remove rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO remove rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			remove: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.remove(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-remove-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
