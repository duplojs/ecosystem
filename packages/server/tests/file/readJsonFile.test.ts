import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setBunMock } from "@tests/_utils/bun.mock";

describe("readJsonFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("reads json file in NODE env", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readFile: vi.fn().mockResolvedValue("{\"count\":1}"),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isRight(result)).toBe(true);
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toEqual({ count: 1 });
		}
	});

	it("returns fail when NODE JSON parse throws", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readFile: vi.fn().mockResolvedValue("{bad"),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail when DENO JSON parse throws", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readTextFile: vi.fn().mockResolvedValue("{bad"),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads json file in DENO env", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readTextFile: vi.fn().mockResolvedValue("{\"value\":2}"),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isRight(result)).toBe(true);
	});

	it("reads json file in BUN env", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				text: vi.fn().mockResolvedValue("{\"value\":3}"),
			}),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isRight(result)).toBe(true);
	});

	it("returns fail when BUN readJsonFile rejects", async() => {
		setEnvironment("BUN");
		setBunMock({
			file: vi.fn().mockReturnValue({
				text: vi.fn().mockRejectedValue(new Error("boom")),
			}),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock.json"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE readJsonFile rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readJsonFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readJsonFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE readJsonFile rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE readJsonFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readJsonFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readJsonFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE readJsonFile rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readJsonFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readJsonFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO readJsonFile rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readJsonFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readJsonFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO readJsonFile rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO readJsonFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO readJsonFile rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO readJsonFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			readTextFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readJsonFile(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-json-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
