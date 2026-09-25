import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { DSFile, setEnvironment } from "@scripts";
import { setFsPromisesMock } from "@tests/_utils/fsPromises.mock";
import { denoErrorsMock, setDenoMock } from "@tests/_utils/deno.mock";

describe("rename", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("renames file in NODE env", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("new.txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/file.txt", "/tmp/new.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/new.txt");
		}
	});

	it("returns fail when NODE rename rejects", async() => {
		setEnvironment("NODE");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("new.txt"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail when NODE rename has no parent path", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn(),
		});

		const result = await DSFile.rename(DCommon.infer("/"), DCommon.infer("new.txt"));

		expect(DEither.isLeft(result)).toBe(true);
		expect(fs.rename).not.toHaveBeenCalled();
	});

	it("resolves NODE renamed path from parent and new name", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("newname.txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/file.txt", "/tmp/newname.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/newname.txt");
		}
	});

	it("renames file in DENO env", async() => {
		setEnvironment("DENO");
		const rename = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ rename });

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("new.txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(rename).toHaveBeenCalledWith("/tmp/file.txt", "/tmp/new.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/new.txt");
		}
	});

	it("returns fail when DENO rename rejects", async() => {
		setEnvironment("DENO");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(new Error("boom")),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("new.txt"));

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("returns fail when DENO rename has no parent path", async() => {
		setEnvironment("DENO");
		const rename = vi.fn();
		setDenoMock({ rename });

		const result = await DSFile.rename(DCommon.infer("/"), DCommon.infer("new.txt"));

		expect(DEither.isLeft(result)).toBe(true);
		expect(rename).not.toHaveBeenCalled();
	});

	it("resolves DENO renamed path from parent and new name", async() => {
		setEnvironment("DENO");
		const rename = vi.fn().mockResolvedValue(undefined);
		setDenoMock({ rename });

		const result = await DSFile.rename(DCommon.infer("/tmp/file.txt"), DCommon.infer("newname.txt"));

		expect(DEither.isRight(result)).toBe(true);
		expect(rename).toHaveBeenCalledWith("/tmp/file.txt", "/tmp/newname.txt");
		if (DEither.isRight(result)) {
			expect(DEither.unwrapRight(result)).toBe("/tmp/newname.txt");
		}
	});
	it("returns not-found when NODE rename rejects with ENOENT", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOENT"),
			{ code: "ENOENT" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE rename rejects with EACCES", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EACCES"),
			{ code: "EACCES" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when NODE rename rejects with EPERM", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EPERM"),
			{ code: "EPERM" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when NODE rename rejects with EEXIST", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EEXIST"),
			{ code: "EEXIST" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when NODE rename rejects with EISDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EISDIR"),
			{ code: "EISDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when NODE rename rejects with ENOTDIR", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTDIR"),
			{ code: "ENOTDIR" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns directory-not-empty when NODE rename rejects with ENOTEMPTY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("ENOTEMPTY"),
			{ code: "ENOTEMPTY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-directory-not-empty",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns read-only when NODE rename rejects with EROFS", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EROFS"),
			{ code: "EROFS" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-read-only",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when NODE rename rejects with EINVAL", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EINVAL"),
			{ code: "EINVAL" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when NODE rename rejects with EBUSY", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EBUSY"),
			{ code: "EBUSY" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns cross-device when NODE rename rejects with EXDEV", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("EXDEV"),
			{ code: "EXDEV" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-cross-device",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE rename rejects with an unknown error", async() => {
		setEnvironment("NODE");
		const error = new Error("unexpected");
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when NODE rename rejects with an unknown code", async() => {
		setEnvironment("NODE");
		const error = Object.assign(
			new Error("UNKNOWN"),
			{ code: "UNKNOWN" },
		);
		setFsPromisesMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-found when DENO rename rejects with NotFound", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotFound("not-found");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-not-found",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO rename rejects with PermissionDenied", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.PermissionDenied("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns permission-denied when DENO rename rejects with NotCapable", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotCapable("permission-denied");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-permission-denied",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns already-exists when DENO rename rejects with AlreadyExists", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.AlreadyExists("already-exists");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-already-exists",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns is-directory when DENO rename rejects with IsADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.IsADirectory("is-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-is-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns not-directory when DENO rename rejects with NotADirectory", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.NotADirectory("not-directory");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-not-directory",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns invalid-argument when DENO rename rejects with InvalidData", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.InvalidData("invalid-argument");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-invalid-argument",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns busy when DENO rename rejects with Busy", async() => {
		setEnvironment("DENO");
		const error = new denoErrorsMock.Busy("busy");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-busy",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("returns error when DENO rename rejects with an unknown error", async() => {
		setEnvironment("DENO");
		const error = new Error("unexpected");
		setDenoMock({
			rename: vi.fn().mockRejectedValue(error),
		});

		const result = await DSFile.rename(DCommon.infer("/tmp/from.txt"), DCommon.infer("renamed.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename-error",
		)).toBe(true);
		if (DEither.isLeft(result)) {
			expect(DEither.unwrapLeft(result)).toBe(error);
		}
	});

	it("supports pipeable rename signature", async() => {
		setEnvironment("NODE");
		const fs = setFsPromisesMock({
			rename: vi.fn().mockResolvedValue(undefined),
		});

		const operation = DSFile.rename(DCommon.infer("renamed.txt"));

		const result = await operation(DCommon.infer("/tmp/from.txt"));

		expect(DEither.hasInformation(
			result,
			"file-system-rename",
		)).toBe(true);
		expect(fs.rename).toHaveBeenCalledWith("/tmp/from.txt", "/tmp/renamed.txt");
	});
});
