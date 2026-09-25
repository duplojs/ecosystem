import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";

describe("copy", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("copies entry in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			cp: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.cp).toHaveBeenCalledWith("/tmp/from", "/tmp/to", { recursive: true });
	});

	it("returns fail when NODE copy rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.isLeft(result)).toBe(true);
	});
	it("returns not-found when NODE copy rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE copy rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE copy rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE copy rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE copy rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns no-space when NODE copy rejects with ENOSPC", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOSPC"),
			{ code: "ENOSPC" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-no-space",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE copy rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE copy rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE copy rejects with EMFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EMFILE"),
			{ code: "EMFILE" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns too-many-open-files when NODE copy rejects with ENFILE", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENFILE"),
			{ code: "ENFILE" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-too-many-open-files",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE copy rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE copy rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE copy rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			cp: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.copy(DCommon.infer("/tmp/from"), DCommon.infer("/tmp/to"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable copy signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			cp: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.copy(DCommon.infer("/tmp/to"));

		const result = await operation(DCommon.infer("/tmp/from"));

		expect(DEither.hasInformation(
			result,
			"file-system-copy",
		)).toBe(true);
		expect(fs.cp).toHaveBeenCalledWith("/tmp/from", "/tmp/to", { recursive: true });
	});
});
