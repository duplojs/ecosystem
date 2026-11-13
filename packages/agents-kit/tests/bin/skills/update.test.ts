import { SkillEnum, updateSkillsCommand } from "@scripts/bin/skills";
import { getPackagePath } from "@scripts/bin/packagePath";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";
import * as DSFile from "@duplojs/server/file";

const skillsPath = DPath.resolveRelative([getPackagePath(), DPath.declarePath("skills")]);
const symlinkStat: DSFile.StatInfo = {
	isSymlink: true,
	isDirectory: false,
	isFile: false,
	sizeBytes: 0,
	modifiedAt: null,
	accessedAt: null,
	createdAt: null,
	changedAt: null,
	deviceId: 0,
	inode: null,
	permissionsMode: null,
	hardLinkCount: null,
	ownerUserId: null,
	ownerGroupId: null,
	specialDeviceId: null,
	ioBlockSize: null,
	allocatedBlockCount: null,
	isBlockDevice: null,
	isCharacterDevice: null,
	isFifo: null,
	isSocket: null,
};

describe("updateSkillsCommand", () => {
	const remove = vi.fn<typeof DSFile.remove>();
	const symlink = vi.fn<typeof DSFile.symlink>();
	const copy = vi.fn<typeof DSFile.copy>();
	const linkStat = vi.fn<typeof DSFile.linkStat>();
	const readDirectory = vi.fn();
	const missingSkill = DEither.left("file-system-link-stat-error", new DSFile.LinkStatErrorNotFound(new Error("Missing")));

	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		remove.mockReset().mockResolvedValue(DEither.right("file-system-remove"));
		symlink.mockReset().mockResolvedValue(DEither.right("file-system-symlink"));
		copy.mockReset().mockResolvedValue(DEither.right("file-system-copy"));
		linkStat.mockReset().mockResolvedValue(missingSkill);
		readDirectory.mockReset();
		TESTImplementation.set("remove", remove);
		TESTImplementation.set("symlink", symlink);
		TESTImplementation.set("copy", copy);
		TESTImplementation.set("linkStat", linkStat);
		TESTImplementation.set("readDirectory", readDirectory);
		TESTImplementation.set("ensureDirectory", () => Promise.resolve(DEither.right("file-system-ensure-directory")));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			args: [],
			folder: ".agents",
		},
		{
			args: ["--type", "default"],
			folder: ".agents",
		},
		{
			args: ["--type", "codex"],
			folder: ".codex",
		},
		{
			args: ["--type", "claude"],
			folder: ".claude",
		},
	])("recreates existing links for $args without installing missing skills", async({ args, folder }) => {
		const error = DSCommand.createError("update");
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", symlinkStat));

		const result = await updateSkillsCommand.execute(args, error);

		type _CheckCommand = DCommon.ExpectType<typeof updateSkillsCommand, DSCommand.Command<"update">, "strict">;
		type _CheckResult = DCommon.ExpectType<typeof result, undefined | DSCommand.SymbolCommandError, "strict">;

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(readDirectory).not.toHaveBeenCalled();
		expect(linkStat).toHaveBeenCalledTimes(SkillEnum.toTuple().length);
		for (const skill of SkillEnum.toTuple()) {
			expect(linkStat).toHaveBeenCalledWith(`/project/${folder}/skills/duplojs-${skill}`);
		}
		expect(remove).toHaveBeenCalledExactlyOnceWith(`/project/${folder}/skills/duplojs-fundamental`, { recursive: true });
		const relativeSkillsPath = DPath.computeRelative(DPath.createAbsoluteOrThrow(`/project/${folder}/skills`), skillsPath);
		expect(symlink).toHaveBeenCalledExactlyOnceWith(`${relativeSkillsPath}/fundamental`, `/project/${folder}/skills/duplojs-fundamental`);
		expect(copy).not.toHaveBeenCalled();
	});

	it.each([
		["default", ".agents"],
		["codex", ".codex"],
		["claude", ".claude"],
	])("updates copied skills for %s without converting them to links", async(agent, folder) => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", {
			...symlinkStat,
			isSymlink: false,
			isDirectory: true,
		}));

		await updateSkillsCommand.execute(["--type", agent], DSCommand.createError("update"));

		expect(remove).toHaveBeenCalledExactlyOnceWith(`/project/${folder}/skills/duplojs-fundamental`, { recursive: true });
		expect(copy).toHaveBeenCalledExactlyOnceWith(`${skillsPath}/fundamental`, `/project/${folder}/skills/duplojs-fundamental`);
		expect(symlink).not.toHaveBeenCalled();
	});

	it("preserves regular files and does not read the skills directory", async() => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", {
			...symlinkStat,
			isSymlink: false,
			isFile: true,
		}));

		await updateSkillsCommand.execute([], DSCommand.createError("update"));

		expect(readDirectory).not.toHaveBeenCalled();
		expect(linkStat).toHaveBeenCalledTimes(SkillEnum.toTuple().length);
		expect(remove).not.toHaveBeenCalled();
		expect(symlink).not.toHaveBeenCalled();
		expect(copy).not.toHaveBeenCalled();
	});

	it("skips missing skills without installing them", async() => {
		await expect(updateSkillsCommand.execute([], DSCommand.createError("update"))).resolves.toBeUndefined();

		expect(linkStat).toHaveBeenCalledTimes(SkillEnum.toTuple().length);
		expect(readDirectory).not.toHaveBeenCalled();
		expect(remove).not.toHaveBeenCalled();
		expect(symlink).not.toHaveBeenCalled();
		expect(copy).not.toHaveBeenCalled();
	});

	it("does not inspect skills when the working directory is unavailable", async() => {
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error(new Error("Unavailable")));

		await expect(updateSkillsCommand.execute([], DSCommand.createError("update"))).resolves.toBeUndefined();

		expect(linkStat).not.toHaveBeenCalled();
	});

	it("continues after a failed inspection and updates the next installed skill", async() => {
		linkStat.mockResolvedValueOnce(DEither.left("file-system-link-stat-error", new DSFile.LinkStatErrorPermissionDenied(new Error("Denied"))))
			.mockResolvedValueOnce(DEither.right("file-system-link-stat", symlinkStat));

		await expect(updateSkillsCommand.execute([], DSCommand.createError("update"))).resolves.toBeUndefined();

		const relativeSkillsPath = DPath.computeRelative(DPath.declareAbsolutePath("/project/.agents/skills"), skillsPath);
		expect(symlink).toHaveBeenCalledExactlyOnceWith(`${relativeSkillsPath}/http-server`, "/project/.agents/skills/duplojs-http-server");
	});

	it("does not create a link when removal fails", async() => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", symlinkStat));
		remove.mockResolvedValue(DEither.left("file-system-remove-error", new DSFile.RemoveErrorPermissionDenied(new Error("Denied"))));

		await expect(updateSkillsCommand.execute([], DSCommand.createError("update"))).resolves.toBeUndefined();

		expect(symlink).not.toHaveBeenCalled();
	});

	it("waits for link recreation to finish", async() => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", symlinkStat));
		const pending = Promise.withResolvers<DSFile.SymlinkResult>();
		symlink.mockReturnValue(pending.promise);
		const finished = vi.fn();

		const execution = updateSkillsCommand.execute([], DSCommand.createError("update")).then(finished);

		await vi.waitFor(() => expect(symlink).toHaveBeenCalledTimes(1));
		expect(finished).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-symlink"));
		await execution;
		expect(finished).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it("waits for a copied skill update to finish", async() => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", {
			...symlinkStat,
			isSymlink: false,
			isDirectory: true,
		}));
		const pending = Promise.withResolvers<DSFile.CopyResult>();
		copy.mockReturnValue(pending.promise);
		const finished = vi.fn();

		const execution = updateSkillsCommand.execute([], DSCommand.createError("update")).then(finished);

		await vi.waitFor(() => expect(copy).toHaveBeenCalledTimes(1));
		expect(finished).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-copy"));
		await execution;
		expect(finished).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it("does not throw when updating a copied skill fails", async() => {
		linkStat.mockResolvedValueOnce(DEither.right("file-system-link-stat", {
			...symlinkStat,
			isSymlink: false,
			isDirectory: true,
		}));
		copy.mockResolvedValue(DEither.left("file-system-copy-error", new DSFile.CopyErrorPermissionDenied(new Error("Denied"))));

		await expect(updateSkillsCommand.execute([], DSCommand.createError("update"))).resolves.toBeUndefined();

		expect(symlink).not.toHaveBeenCalled();
	});

	it.each([
		["--type", "unknown"],
		["--copy"],
		["fundamental"],
	])("rejects invalid arguments %j", async(...args) => {
		const error = DSCommand.createError("update");

		const result = await updateSkillsCommand.execute(args, error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toHaveLength(1);
		expect(readDirectory).not.toHaveBeenCalled();
	});
});
