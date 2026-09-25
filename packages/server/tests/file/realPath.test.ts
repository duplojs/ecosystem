import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("realPath", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns real path in NODE env", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			realpath: vi.fn().mockResolvedValue("/real/path"),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/real/path");
		}
	});

	it("returns fail in NODE env when realpath rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns real path in DENO env", async() => {
		setEnvironment("DENO");
		setDenoMock({
			realPath: vi.fn().mockResolvedValue("/deno/real"),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/deno/real");
		}
	});

	it("returns fail in DENO env when realPath rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE realPath rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE realPath rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE realPath rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE realPath rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE realPath rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE realPath rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE realPath rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE realPath rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			realpath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO realPath rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO realPath rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO realPath rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO realPath rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO realPath rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			realPath: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.realPath(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-real-path-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
