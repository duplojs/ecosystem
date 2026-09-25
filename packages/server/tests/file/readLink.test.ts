import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("readLink", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("reads link in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			readlink: vi.fn().mockResolvedValue("/tmp/target"),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/link"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.readlink).toHaveBeenCalledWith("/tmp/link", { encoding: "utf-8" });
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/target");
		}
	});

	it("returns fail when NODE readLink rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/link"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("reads link in DENO env", async() => {
		setEnvironment("DENO");
		const readLink = vi.fn().mockResolvedValue("/tmp/deno-target");
		setDenoMock({ readLink });

		const result = await DSFile.readLink(DCommon.infer("/tmp/link"));

		expect(DEither.isRight(result)).toBe(true);
		expect(readLink).toHaveBeenCalledWith("/tmp/link");
	});

	it("returns fail when DENO readLink rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/link"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE readLink rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readLink rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE readLink rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE readLink rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE readLink rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readLink rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE readLink rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readLink rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE readLink rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			readlink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO readLink rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readLink rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO readLink rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO readLink rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO readLink rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO readLink rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			readLink: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.readLink(DCommon.infer("/tmp/mock"));

		expect(DEither.hasInformation(
			result,
			"file-system-read-link-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
