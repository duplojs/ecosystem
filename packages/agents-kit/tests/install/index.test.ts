import { installCommand, skillsPath } from "@scripts";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";
import type * as DSFile from "@duplojs/server/file";

describe("installCommand", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("remove", () => Promise.resolve(DEither.right("file-system-remove")));
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			args: ["http"],
			folder: ".agents",
			skills: ["http"],
		},
		{
			args: ["http", "--type", "claude"],
			folder: ".claude",
			skills: ["http"],
		},
		{
			args: ["fundamental", "--type", "codex"],
			folder: ".codex",
			skills: ["fundamental"],
		},
		{
			args: [],
			folder: ".agents",
			skills: ["fundamental", "http"],
		},
		{
			args: ["--type", "codex"],
			folder: ".codex",
			skills: ["fundamental", "http"],
		},
	])("links skills by default for $args", async({ args, folder, skills }) => {
		const entries = DArray.map(["fundamental", "README.md", "http", "unknown"], DPath.createOrThrow);
		const copy = vi.fn();
		const symlink = vi.fn(() => Promise.resolve(DEither.right("file-system-symlink")));
		TESTImplementation.set("readDirectory", () => Promise.resolve(DEither.right("file-system-read-directory", entries as never)));
		TESTImplementation.set("ensureDirectory", () => Promise.resolve(DEither.right("file-system-ensure-directory")));
		TESTImplementation.set("symlink", symlink);
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");

		const result = await installCommand.execute(args, error);

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(copy).not.toHaveBeenCalled();
		expect(symlink).toHaveBeenCalledTimes(skills.length);
		for (const skill of skills) {
			expect(symlink).toHaveBeenCalledWith(`${skillsPath}/${skill}`, `/project/${folder}/skills/duplojs-${skill}`, { type: "dir" });
		}
	});

	it.each(["fundamental", "http"])("installs the selected %s skill", async(skill) => {
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		const readDirectory = vi.fn();
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("readDirectory", readDirectory);
		const error = DSCommand.createError("install");

		const result = await installCommand.execute([skill, "--copy"], error);

		type _CheckCommand = DCommon.ExpectType<typeof installCommand, DSCommand.Command<"install">, "strict">;
		type _CheckResult = DCommon.ExpectType<typeof result, undefined | DSCommand.SymbolCommandError, "strict">;

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/${skill}`, `/project/.agents/skills/duplojs-${skill}`);
		expect(readDirectory).not.toHaveBeenCalled();
	});

	it.each([
		["default", ".agents"],
		["claude", ".claude"],
		["codex", ".codex"],
	])("installs into the %s agent folder", async(agent, folder) => {
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");

		await expect(installCommand.execute(["http", "--type", agent, "--copy"], error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/http`, `/project/${folder}/skills/duplojs-http`);
	});

	it.each([
		[[], ".agents"],
		[["--type", "codex"], ".codex"],
	] as const)("installs all supported skills for arguments %j", async(args, folder) => {
		const entries = DArray.map(["fundamental", "README.md", "http", "unknown"], DPath.createOrThrow);
		const readDirectory = vi.fn(() => Promise.resolve(DEither.right("file-system-read-directory", entries as never)));
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		TESTImplementation.set("readDirectory", readDirectory);
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");

		await expect(installCommand.execute([...args, "--copy"], error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(readDirectory).toHaveBeenCalledExactlyOnceWith(skillsPath);
		expect(copy).toHaveBeenCalledTimes(2);
		expect(copy).toHaveBeenNthCalledWith(1, `${skillsPath}/fundamental`, `/project/${folder}/skills/duplojs-fundamental`);
		expect(copy).toHaveBeenNthCalledWith(2, `${skillsPath}/http`, `/project/${folder}/skills/duplojs-http`);
	});

	it("does not copy unsupported directory entries", async() => {
		const entries = DArray.map(["README.md", "unknown"], DPath.createOrThrow);
		const readDirectory = vi.fn(() => Promise.resolve(DEither.right("file-system-read-directory", entries as never)));
		const copy = vi.fn();
		TESTImplementation.set("readDirectory", readDirectory);
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");

		await expect(installCommand.execute(["--copy"], error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(readDirectory).toHaveBeenCalledExactlyOnceWith(skillsPath);
		expect(copy).not.toHaveBeenCalled();
	});

	it("does not copy when reading the directory fails", async() => {
		class ReadDirectoryError extends DCommon.DuploJSError.parentClass("file-system-read-directory-error", Error) {}
		const readDirectory = vi.fn(() => Promise.resolve(DEither.left("file-system-read-directory-error", new ReadDirectoryError(new Error("Read denied")))));
		const copy = vi.fn();
		TESTImplementation.set("readDirectory", readDirectory);
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");

		await expect(installCommand.execute(["--copy"], error)).resolves.toBeUndefined();

		expect(error.issues).toEqual([]);
		expect(readDirectory).toHaveBeenCalledExactlyOnceWith(skillsPath);
		expect(copy).not.toHaveBeenCalled();
	});

	it.each([
		["unknown"],
		["http", "--type", "unknown"],
	])("rejects invalid arguments %j", async(...args) => {
		const copy = vi.fn();
		const readDirectory = vi.fn();
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("readDirectory", readDirectory);
		const error = DSCommand.createError("install");

		await expect(installCommand.execute([...args, "--copy"], error)).resolves.toBe(DSCommand.SymbolCommandError);

		expect(error.issues).toHaveLength(1);
		expect(copy).not.toHaveBeenCalled();
		expect(readDirectory).not.toHaveBeenCalled();
	});

	it("waits for the selected skill copy", async() => {
		const pending = Promise.withResolvers<DSFile.CopyResult>();
		const copy = vi.fn(() => pending.promise);
		TESTImplementation.set("copy", copy);
		const error = DSCommand.createError("install");
		const finished = vi.fn();

		const execution = installCommand.execute(["http", "--copy"], error).then(finished);

		await vi.waitFor(() => expect(copy).toHaveBeenCalledTimes(1));
		expect(finished).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-copy"));
		await execution;

		expect(finished).toHaveBeenCalledExactlyOnceWith(undefined);
		expect(error.issues).toEqual([]);
	});

	it("propagates a rejected copy", async() => {
		const failure = new Error("Copy failed");
		TESTImplementation.set("copy", vi.fn().mockRejectedValue(failure));

		await expect(installCommand.execute(["http", "--copy"], DSCommand.createError("install"))).rejects.toThrow(failure);
	});
});
