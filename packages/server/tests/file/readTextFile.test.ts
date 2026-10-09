import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";
import { expectFileSystemError } from "@tests/_utils/fileSystemError";

describe("readTextFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("reads text file in NODE env", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readFile: vi.fn().mockResolvedValue("hello"),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("hello");
		}
	});

	it("returns fail when NODE readTextFile rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads text file in DENO env", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readTextFile: vi.fn().mockResolvedValue("deno"),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("deno");
		}
	});

	it("returns fail when DENO readTextFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads text file in BUN env", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				text: vi.fn().mockResolvedValue("bun"),
			}),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("bun");
		}
	});

	it("returns fail when BUN readTextFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				text: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE readTextFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-not-found", error);
	});

	it("returns permission-denied when NODE readTextFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-permission-denied", error);
	});

	it("returns permission-denied when NODE readTextFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-permission-denied", error);
	});

	it("returns is-directory when NODE readTextFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-is-directory", error);
	});

	it("returns not-directory when NODE readTextFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-not-directory", error);
	});

	it("returns too-many-open-files when NODE readTextFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-too-many-open-files", error);
	});

	it("returns too-many-open-files when NODE readTextFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-too-many-open-files", error);
	});

	it("returns busy when NODE readTextFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-busy", error);
	});

	it("returns error when NODE readTextFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-error", error);
	});

	it("returns error when NODE readTextFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-error", error);
	});

	it("returns not-found when DENO readTextFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-not-found", error);
	});

	it("returns permission-denied when DENO readTextFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-permission-denied", error);
	});

	it("returns permission-denied when DENO readTextFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-permission-denied", error);
	});

	it("returns is-directory when DENO readTextFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-is-directory", error);
	});

	it("returns not-directory when DENO readTextFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-not-directory", error);
	});

	it("returns busy when DENO readTextFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-busy", error);
	});

	it("returns error when DENO readTextFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readTextFile(DCommon.infer("/tmp/mock"));

		expectFileSystemError(result, "file-system-read-text-file-error", error);
	});
});
