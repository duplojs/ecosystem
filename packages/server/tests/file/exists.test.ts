import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import type * as DPath from "@duplojs/lang/path";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("exists", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns ok in NODE env when access resolves", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			access: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
	});

	it("returns fail in NODE env when access rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns ok in DENO env when stat resolves", async() => {
		setEnvironment("DENO");
		setDenoMock({
			stat: vi.fn().mockResolvedValue({}),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
	});

	it("returns fail in DENO env when stat rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns ok in BUN env when file exists", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				exists: vi.fn().mockResolvedValue(true),
			}),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isRight(result)).toBe(true);
	});

	it("returns fail in BUN env when file does not exist", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				exists: vi.fn().mockResolvedValue(false),
			}),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail in BUN env when exists throws", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				exists: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE exists rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE exists rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE exists rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE exists rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE exists rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE exists rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE exists rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE exists rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			access: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO exists rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO exists rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO exists rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO exists rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO exists rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			stat: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.exists(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-exists-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
