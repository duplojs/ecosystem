import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("setOwner", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("sets owner in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chown: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.setOwner(DCommon.infer("/tmp/mock"), {
			userId: 1,
			groupId: 2,
		});

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.chown).toHaveBeenCalledWith("/tmp/mock", 1, 2);
	});

	it("returns fail when NODE setOwner rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.setOwner(DCommon.infer("/tmp/mock"), {
			userId: 1,
			groupId: 2,
		});

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("sets owner in DENO env", async() => {
		setEnvironment("DENO");
		const chown = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ chown });

		const result = await DSFile.setOwner(DCommon.infer("/tmp/mock"), {
			userId: 3,
			groupId: 4,
		});

		expect(DEither.isRight(result)).toBe(true);
		expect(chown).toHaveBeenCalledWith("/tmp/mock", 3, 4);
	});

	it("returns fail when DENO setOwner rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.setOwner(DCommon.infer("/tmp/mock"), {
			userId: 3,
			groupId: 4,
		});

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE setOwner rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setOwner rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE setOwner rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE setOwner rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE setOwner rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE setOwner rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setOwner rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE setOwner rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO setOwner rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setOwner rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO setOwner rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO setOwner rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO setOwner rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO setOwner rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			chown: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.setOwner(
			DCommon.infer("/tmp/mock"),
			{
				userId: 1,
				groupId: 2,
			},
		);

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable setOwner signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			chown: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.setOwner({
			userId: 1,
			groupId: 2,
		});

		const result = await operation(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-set-owner",
		)).toBe(true);
		expect(fs.chown).toHaveBeenCalledWith("/tmp/mock", 1, 2);
	});
});
