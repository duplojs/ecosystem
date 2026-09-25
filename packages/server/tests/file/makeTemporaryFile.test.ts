import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";
import { setOsMock } from "@tests/_utils/os.mock";
import { setCryptoMock } from "@tests/_utils/crypto.mock";

describe("makeTemporaryFile", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("creates temporary file in NODE env", async() => {
		setEnvironment("NODE");
		setOsMock({ tmpdir: vi.fn().mockReturnValue("/tmp") });
		setCryptoMock({ randomUUID: vi.fn().mockReturnValue("uuid") });
		const fs = setFsPromisesMock({
			open: vi.fn().mockResolvedValue({
				close: vi.fn().mockResolvedValue(undefined),
			}),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("pre-"), DCommon.cast(".txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.open).toHaveBeenCalledWith("/tmp/pre-uuid.txt", "wx");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/pre-uuid.txt");
		}
	});

	it("creates temporary file in NODE env without suffix", async() => {
		setEnvironment("NODE");
		setOsMock({ tmpdir: vi.fn().mockReturnValue("/tmp") });
		setCryptoMock({ randomUUID: vi.fn().mockReturnValue("uuid") });
		const fs = setFsPromisesMock({
			open: vi.fn().mockResolvedValue({
				close: vi.fn().mockResolvedValue(undefined),
			}),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("pre-"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.open).toHaveBeenCalledWith("/tmp/pre-uuid", "wx");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/pre-uuid");
		}
	});

	it("returns fail when NODE open rejects", async() => {
		setEnvironment("NODE");
		setOsMock({ tmpdir: vi.fn().mockReturnValue("/tmp") });
		setCryptoMock({ randomUUID: vi.fn().mockReturnValue("uuid") });
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("pre-"), DCommon.cast(".txt"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("creates temporary file in DENO env", async() => {
		setEnvironment("DENO");
		const makeTempFile = vi.fn().mockResolvedValue("/tmp/deno-file");
		setDenoMock({ makeTempFile });

		const result = await DSFile.makeTemporaryFile(DCommon.infer("pre-"), DCommon.cast(".txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(makeTempFile).toHaveBeenCalledWith({
			prefix: "pre-",
			suffix: ".txt",
		});
	});

	it("returns fail when DENO makeTempFile rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("pre-"), DCommon.cast(".txt"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns permission-denied when NODE makeTemporaryFile rejects with EACCES", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE makeTemporaryFile rejects with EPERM", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE makeTemporaryFile rejects with EEXIST", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE makeTemporaryFile rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE makeTemporaryFile rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE makeTemporaryFile rejects with EROFS", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE makeTemporaryFile rejects with EINVAL", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeTemporaryFile rejects with EMFILE", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE makeTemporaryFile rejects with ENFILE", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeTemporaryFile rejects with an unknown error", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = new Error("unexpected");
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE makeTemporaryFile rejects with an unknown code", async() => {
		setEnvironment("NODE");
		setOsMock({
			tmpdir: vi.fn().mockReturnValue("/tmp"),
		});
		setCryptoMock({
			randomUUID: vi.fn().mockReturnValue("uuid"),
		});
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			open: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeTemporaryFile rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO makeTemporaryFile rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO makeTemporaryFile rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO makeTemporaryFile rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO makeTemporaryFile rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO makeTemporaryFile rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			makeTempFile: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.makeTemporaryFile(DCommon.infer("prefix-"), DCommon.cast(".txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-make-temporary-file-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});
});
