import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("writeJsonFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("writes json file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { first: 1 }, { space: 2 });

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith(
			"/tmp/mock.json",
			JSON.stringify({ first: 1 }, null, 2),
			{ encoding: "utf-8" },
		);
	});

	it("returns fail when NODE writeJsonFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { first: 1 });

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes json file in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn().mockResolvedValue(undefined);
		setDenoMock({
			writeTextFile: spy,
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { second: 2 });

		expect(DEither.isRight(result)).toBe(true);
		expect(spy).toHaveBeenCalledWith("/tmp/mock.json", JSON.stringify({ second: 2 }));
	});

	it("returns fail when DENO writeJsonFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { second: 2 });

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("writes json file in BUN env", async() => {
		setEnvironment("BUN");
		const writeSpy = vi.fn().mockResolvedValue(undefined);
		setBunMock({
			file: vi.fn().mockReturnValue({ write: writeSpy }),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { three: 3 });

		expect(DEither.isRight(result)).toBe(true);
		expect(writeSpy).toHaveBeenCalledWith(JSON.stringify({ three: 3 }));
	});

	it("returns fail when BUN writeJsonFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				write: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), { three: 3 });

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail when JSON stringify throws", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn(),
		});
		const circular: { self?: unknown } = {};
		circular.self = circular;

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), circular);

		expect(DEither.isLeft(result)).toBe(true);
		expect(fs.writeFile).not.toHaveBeenCalled();
	});

	it("returns fail when JSON stringify throws in DENO env", async() => {
		setEnvironment("DENO");
		const spy = vi.fn();
		setDenoMock({
			writeTextFile: spy,
		});
		const circular: { self?: unknown } = {};
		circular.self = circular;

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), circular);

		expect(DEither.isLeft(result)).toBe(true);
		expect(spy).not.toHaveBeenCalled();
	});

	it("returns fail when JSON stringify throws in BUN env", async() => {
		setEnvironment("BUN");
		const writeSpy = vi.fn();
		const fileSpy = vi.fn().mockReturnValue({ write: writeSpy });
		setBunMock({
			file: fileSpy,
		});
		const circular: { self?: unknown } = {};
		circular.self = circular;

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock.json"), circular);

		expect(DEither.isLeft(result)).toBe(true);
		expect(fileSpy).not.toHaveBeenCalled();
		expect(writeSpy).not.toHaveBeenCalled();
	});
	it("returns not-found when NODE writeJsonFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeJsonFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE writeJsonFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE writeJsonFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE writeJsonFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE writeJsonFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE writeJsonFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE writeJsonFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeJsonFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE writeJsonFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE writeJsonFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeJsonFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE writeJsonFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			writeFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO writeJsonFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeJsonFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO writeJsonFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO writeJsonFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO writeJsonFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO writeJsonFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO writeJsonFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO writeJsonFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			writeTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.writeJsonFile(DCommon.infer("/tmp/mock"), { value: true });

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable writeJsonFile signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			writeFile: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.writeJsonFile({
			value: true,
		});

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-write-json-file",
		)).toBe(true);
		expect(fs.writeFile).toHaveBeenCalledWith("/tmp/mock", JSON.stringify({ value: true }), { encoding: "utf-8" });
	});
});
