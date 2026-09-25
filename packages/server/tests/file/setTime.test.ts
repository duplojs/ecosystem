import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("setTime", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("sets time in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			utimes: vi.fn().mockResolvedValue(undefined),
		});
		const accessTime = DChrono.createDate("2020-01-01");
		const modifiedTime = DChrono.createDate("2020-01-02");

		const result = await DSFile.setTime(DCommon.infer("/tmp/mock"), {
			accessTime,
			modifiedTime,
		});

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.utimes).toHaveBeenCalledWith(
			"/tmp/mock",
			DChrono.toTimestamp(accessTime),
			DChrono.toTimestamp(modifiedTime),
		);
	});

	it("returns fail when NODE setTime rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(new Error("boom")),
		});
		const accessTime = DChrono.now();
		const modifiedTime = DChrono.now();

		const result = await DSFile.setTime(DCommon.infer("/tmp/mock"), {
			accessTime,
			modifiedTime,
		});

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("sets time in DENO env", async() => {
		setEnvironment("DENO");
		const utime = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ utime });
		const accessTime = DChrono.createDateOrThrow(1704067200000);
		const modifiedTime = DChrono.createDateOrThrow(1704153600000);

		const result = await DSFile.setTime(DCommon.infer("/tmp/mock"), {
			accessTime,
			modifiedTime,
		});

		expect(DEither.isRight(result)).toBe(true);
		expect(utime).toHaveBeenCalledWith(
			"/tmp/mock",
			DChrono.toTimestamp(accessTime),
			DChrono.toTimestamp(modifiedTime),
		);
	});

	it("returns fail when DENO setTime rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(new Error("boom")),
		});
		const accessTime = DChrono.now();
		const modifiedTime = DChrono.now();

		const result = await DSFile.setTime(DCommon.infer("/tmp/mock"), {
			accessTime,
			modifiedTime,
		});

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE setTime rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setTime rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setTime rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE setTime rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE setTime rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE setTime rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setTime rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setTime rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			utimes: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO setTime rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setTime rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setTime rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO setTime rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO setTime rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO setTime rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			utime: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setTime(
			DCommon.infer("/tmp/mock"),
			{
				accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
				modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-time-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable setTime signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			utimes: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.setTime({
			accessTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
			modifiedTime: DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z")),
		});

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-set-time",
		)).toBe(true);
		expect(fs.utimes).toHaveBeenCalledWith("/tmp/mock", DChrono.toTimestamp(DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z"))), DChrono.toTimestamp(DChrono.createDateOrThrow(new Date("2024-01-01T00:00:00.000Z"))));
	});
});
