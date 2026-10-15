import { AgentTypeEnum, copySkill, SkillEnum, symlinkSkill } from "@scripts/bin/install/skill";
import { skillsPath } from "@scripts/bin/install/skillsPath";
import * as DArray from "@duplojs/lang/array";
import * as DGenerator from "@duplojs/lang/generator";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";

describe("SkillEnum", () => {
	it("matches SkillEnum exactly to the directories in skillsPath", async() => {
		const directories = await DCommon.asyncPipe(
			skillsPath,
			DSFile.walkDirectory,
			DEither.unwrapByInformationOrThrow("file-system-walk-directory"),
			DGenerator.filter(DSFile.isFolderInterface),
			DGenerator.map((folder) => folder.getName()),
			DArray.from,
		);
		const skills = SkillEnum.toTuple();

		expect(directories).toHaveLength(skills.length);
		expect(directories).toEqual(expect.arrayContaining([...skills]));
	});
});

describe("copySkill", () => {
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
		["default", "fundamental", ".agents"],
		["claude", "http", ".claude"],
		["codex", "fundamental", ".codex"],
	] as const)("copies %s/%s into the working directory", async(agent, skill, folder) => {
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		TESTImplementation.set("copy", copy);

		const result = await copySkill(agent, skill);

		type _CheckResult = DCommon.ExpectType<typeof result, DSFile.CopyResult | Extract<DSFile.RemoveResult, DEither.Left>, "strict">;

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-copy")).toBeUndefined();
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/${skill}`, `/project/${folder}/skills/duplojs-${skill}`);
	});

	it("preserves a copy error", async() => {
		class CopyError extends DCommon.DuploJSError.parentClass("file-system-copy-error", Error) {}
		const failure = new CopyError(new Error("Copy denied"));
		TESTImplementation.set("copy", () => Promise.resolve(DEither.left("file-system-copy-error", failure)));

		const result = await copySkill("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-copy-error")).toBe(failure);
	});

	it("does not copy when the working directory is unavailable", () => {
		const copy = vi.fn();
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error(new Error("Unavailable")));

		expect(() => copySkill("codex", "http")).toThrow(DSCommon.GetCurrentWorkDirectoryError);
		expect(copy).not.toHaveBeenCalled();
	});
});

describe("symlinkSkill", () => {
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
		["default", "fundamental", ".agents"],
		["claude", "http", ".claude"],
		["codex", "fundamental", ".codex"],
	] as const)("links %s/%s after creating its parent directory", async(agent, skill, folder) => {
		const pending = Promise.withResolvers<DSFile.EnsureDirectoryResult>();
		const ensureDirectory = vi.fn(() => pending.promise);
		const symlink = vi.fn(() => Promise.resolve(DEither.right("file-system-symlink")));
		TESTImplementation.set("ensureDirectory", ensureDirectory);
		TESTImplementation.set("symlink", symlink);

		const execution = symlinkSkill(agent, skill);

		expect(ensureDirectory).toHaveBeenCalledExactlyOnceWith(`/project/${folder}/skills`);
		expect(symlink).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-ensure-directory"));
		const result = await execution;

		type _CheckResult = DCommon.ExpectType<typeof result, DSFile.SymlinkResult | Extract<DSFile.EnsureDirectoryResult | DSFile.RemoveResult, DEither.Left>, "strict">;

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-symlink")).toBeUndefined();
		expect(symlink).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/${skill}`, `/project/${folder}/skills/duplojs-${skill}`, { type: "dir" });
	});

	it("preserves a directory creation error without creating a link", async() => {
		class EnsureDirectoryError extends DCommon.DuploJSError.parentClass("file-system-ensure-directory-error", Error) {}
		const failure = new EnsureDirectoryError(new Error("Directory denied"));
		const symlink = vi.fn();
		TESTImplementation.set("ensureDirectory", () => Promise.resolve(DEither.left("file-system-ensure-directory-error", failure)));
		TESTImplementation.set("symlink", symlink);

		const result = await symlinkSkill("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-ensure-directory-error")).toBe(failure);
		expect(symlink).not.toHaveBeenCalled();
	});

	it("preserves a symbolic link error", async() => {
		class SymlinkError extends DCommon.DuploJSError.parentClass("file-system-symlink-error", Error) {}
		const failure = new SymlinkError(new Error("Link denied"));
		TESTImplementation.set("ensureDirectory", () => Promise.resolve(DEither.right("file-system-ensure-directory")));
		TESTImplementation.set("symlink", () => Promise.resolve(DEither.left("file-system-symlink-error", failure)));

		const result = await symlinkSkill("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-symlink-error")).toBe(failure);
	});
});

describe.each([
	{
		install: copySkill,
		name: "copySkill",
		information: "file-system-copy",
	},
	{
		install: symlinkSkill,
		name: "symlinkSkill",
		information: "file-system-symlink",
	},
] as const)("$name replacement", ({ install, information }) => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		TESTImplementation.set("ensureDirectory", () => Promise.resolve(DEither.right("file-system-ensure-directory")));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("waits for the existing destination to be removed before installing", async() => {
		const pending = Promise.withResolvers<DSFile.RemoveResult>();
		const remove = vi.fn(() => pending.promise);
		const copy = vi.fn(() => Promise.resolve(DEither.right("file-system-copy")));
		const symlink = vi.fn(() => Promise.resolve(DEither.right("file-system-symlink")));
		TESTImplementation.set("remove", remove);
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("symlink", symlink);

		const execution = install("codex", "http");

		await vi.waitFor(() => expect(remove).toHaveBeenCalledExactlyOnceWith("/project/.codex/skills/duplojs-http", { recursive: true }));
		expect(copy).not.toHaveBeenCalled();
		expect(symlink).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-remove"));
		const result = await execution;

		expect(DEither.unwrapByInformationOrThrow(result, information)).toBeUndefined();
	});

	it("preserves a removal error without installing", async() => {
		class RemoveError extends DCommon.DuploJSError.parentClass("file-system-remove-error", Error) {}
		const failure = new RemoveError(new Error("Removal denied"));
		const copy = vi.fn();
		const symlink = vi.fn();
		TESTImplementation.set("remove", () => Promise.resolve(DEither.left("file-system-remove-error", failure)));
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("symlink", symlink);

		const result = await install("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, "file-system-remove-error")).toBe(failure);
		expect(copy).not.toHaveBeenCalled();
		expect(symlink).not.toHaveBeenCalled();
	});

	it("installs when the destination does not exist", async() => {
		class RemoveErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-remove-not-found", Error) {}
		TESTImplementation.set("remove", () => Promise.resolve(DEither.left("file-system-remove-error", new RemoveErrorNotFound(new Error("Not found")))));
		TESTImplementation.set("copy", () => Promise.resolve(DEither.right("file-system-copy")));
		TESTImplementation.set("symlink", () => Promise.resolve(DEither.right("file-system-symlink")));

		const result = await install("default", "http");

		expect(DEither.unwrapByInformationOrThrow(result, information)).toBeUndefined();
	});
});
