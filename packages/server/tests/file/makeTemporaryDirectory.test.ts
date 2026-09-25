import * as DEither from "@duplojs/lang/either";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("makeTemporaryDirectory", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates temporary directory in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			mkdtemp: vi.fn().mockResolvedValue("/tmp/prefix-abc"),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.mkdtemp).toHaveBeenCalledWith("prefix-");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/prefix-abc");
		}
	});

	it("returns fail when NODE mkdtemp rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("creates temporary directory in DENO env", async() => {
		setEnvironment("DENO");
		const makeTempDir = vi.fn().mockResolvedValue("/tmp/deno-dir");
		setDenoMock({ makeTempDir });

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.isRight(result)).toBe(true);
		expect(makeTempDir).toHaveBeenCalledWith({ prefix: "prefix-" });
	});

	it("returns fail when DENO makeTempDir rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns permission-denied when NODE makeTemporaryDirectory rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE makeTemporaryDirectory rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE makeTemporaryDirectory rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE makeTemporaryDirectory rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE makeTemporaryDirectory rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE makeTemporaryDirectory rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeTemporaryDirectory rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeTemporaryDirectory rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeTemporaryDirectory rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeTemporaryDirectory rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			mkdtemp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeTemporaryDirectory rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeTemporaryDirectory rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO makeTemporaryDirectory rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO makeTemporaryDirectory rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO makeTemporaryDirectory rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			makeTempDir: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryDirectory("prefix-");

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-directory-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
