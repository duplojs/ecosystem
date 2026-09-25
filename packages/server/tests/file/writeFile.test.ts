import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("writeFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("writes file in NODE env", async() => {
		setEnvironment("NODE");
		const data = new Uint8Array([1]);
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), data);

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith("/tmp/mock", data);
	});

	it("returns fail when NODE writeFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes file in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			writeFile: spy,
		});

		const data = new Uint8Array([2]);
		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), data);

		expect(DEither.isRight(result)).toBe(true);
		expect(spy).toHaveBeenCalledWith("/tmp/mock", data);
	});

	it("returns fail when DENO writeFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([3]));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes file in BUN env", async() => {
		setEnvironment("BUN");
		const writeSpy = vi.fn().mockResolvedValue(undefined);
		setBunMock({
			file: vi.fn().mockReturnValue({ write: writeSpy }),
		});

		const data = new Uint8Array([4]);
		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), data);

		expect(DEither.isRight(result)).toBe(true);
		expect(writeSpy).toHaveBeenCalledWith(data);
	});

	it("returns fail when BUN writeFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				write: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([5]));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE writeFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE writeFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE writeFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE writeFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE writeFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE writeFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE writeFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO writeFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO writeFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO writeFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO writeFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO writeFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO writeFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeFile(DCommon.infer("/tmp/mock"), new Uint8Array([1]));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable writeFile signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.writeFile(new Uint8Array([1]));

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-write-file",
		)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith("/tmp/mock", new Uint8Array([1]));
	});
});
