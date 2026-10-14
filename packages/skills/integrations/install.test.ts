import { execFileSync, spawnSync } from "node:child_process";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

const integrationsDirectory = DPath.createOrThrow(import.meta.dirname);
const skillsDirectory = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("../skills")]);
const workspace = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("test-output.generate/project with spaces")]);

describe("install integration", () => {
	beforeEach(async() => {
		await DCommon.asyncPipe(
			workspace,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);
		const sourceModules = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("node_modules")]);
		const targetModules = DPath.resolveRelative([workspace, DPath.declarePath("node_modules")]);
		await DCommon.asyncPipe(
			DSFile.symlink(sourceModules, targetModules, { type: "dir" }),
			DEither.unwrapByInformationOrThrow("file-system-symlink"),
		);
	});

	afterEach(async() => {
		await DCommon.asyncPipe(
			DSFile.remove(workspace, { recursive: true }),
			DEither.unwrapByInformationOrThrow("file-system-remove"),
		);
	});

	it.each([
		[["install", "fundamental"], ".agents", ["fundamental"]],
		[["install", "http"], ".agents", ["http"]],
		[["install", "http", "--type", "default"], ".agents", ["http"]],
		[["install", "fundamental", "--type", "claude"], ".claude", ["fundamental"]],
		[["install", "http", "--type", "codex"], ".codex", ["http"]],
		[["install"], ".agents", ["fundamental", "http"]],
		[["install", "--type", "claude"], ".claude", ["fundamental", "http"]],
		[["install", "--type", "codex"], ".codex", ["fundamental", "http"]],
	] as const)("copies skills for %j into %s", async(args, agentFolder, skills) => {
		execFileSync("pnpm", ["exec", "duplojs-skills", ...args], { cwd: workspace });

		const workspaceEntries = await DCommon.asyncPipe(
			workspace,
			DSFile.readDirectory,
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
		);
		expect(workspaceEntries).toEqual([agentFolder, "node_modules"]);

		const installedDirectory = DPath.resolveRelative([workspace, DCommon.cast(agentFolder), DCommon.cast("skills")]);
		const expectedSkills = DCommon.pipe(
			skills,
			DArray.map((skill) => `duplojs-${skill}`),
			DString.sort("ASC"),
		);
		const installedSkills = await DCommon.asyncPipe(
			installedDirectory,
			DSFile.readDirectory,
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
			DString.sort("ASC"),
		);
		expect(installedSkills).toEqual(expectedSkills);

		for (const skill of skills) {
			const sourceDirectory = DPath.resolveRelative([skillsDirectory, DCommon.cast(skill)]);
			const copiedDirectory = DPath.resolveRelative([installedDirectory, DCommon.cast(`duplojs-${skill}`)]);
			const sourceEntries = await DCommon.asyncPipe(
				DSFile.readDirectory(sourceDirectory, { recursive: true }),
				DEither.unwrapByInformationOrThrow("file-system-read-directory"),
				DString.sort("ASC"),
			);
			const copiedEntries = await DCommon.asyncPipe(
				DSFile.readDirectory(copiedDirectory, { recursive: true }),
				DEither.unwrapByInformationOrThrow("file-system-read-directory"),
				DString.sort("ASC"),
			);
			expect(sourceEntries).toContain("SKILL.md");
			expect(copiedEntries).toEqual(sourceEntries);

			for (const entry of sourceEntries) {
				const sourcePath = DPath.resolveRelative([sourceDirectory, entry]);
				const copiedPath = DPath.resolveRelative([copiedDirectory, entry]);
				const sourceStat = await DCommon.asyncPipe(
					sourcePath,
					DSFile.stat,
					DEither.unwrapByInformationOrThrow("file-system-stat"),
				);
				const copiedStat = await DCommon.asyncPipe(
					copiedPath,
					DSFile.stat,
					DEither.unwrapByInformationOrThrow("file-system-stat"),
				);
				expect(copiedStat.isDirectory).toBe(sourceStat.isDirectory);

				if (sourceStat.isFile) {
					const sourceContent = await DCommon.asyncPipe(
						sourcePath,
						DSFile.readFile,
						DEither.unwrapByInformationOrThrow("file-system-read-file"),
					);
					const copiedContent = await DCommon.asyncPipe(
						copiedPath,
						DSFile.readFile,
						DEither.unwrapByInformationOrThrow("file-system-read-file"),
					);
					expect(copiedContent).toEqual(sourceContent);
				}
			}
		}
	});

	it.each([
		["default", ".agents"],
		["claude", ".claude"],
		["codex", ".codex"],
	] as const)("installs into an existing %s skills directory", async(agent, agentFolder) => {
		const installedDirectory = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(agentFolder), DPath.declarePath("skills")]);
		const existingFile = DPath.resolveRelative([installedDirectory, DPath.declarePath("existing.txt")]);
		await DCommon.asyncPipe(
			installedDirectory,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);
		await DCommon.asyncPipe(
			existingFile,
			DSFile.writeTextFile("keep this file"),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);

		execFileSync("pnpm", ["exec", "duplojs-skills", "install", "http", "--type", agent], { cwd: workspace });

		const installedEntries = await DCommon.asyncPipe(
			installedDirectory,
			DSFile.readDirectory,
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
			DString.sort("ASC"),
		);
		const existingContent = await DCommon.asyncPipe(
			existingFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		const installedSkill = await DCommon.asyncPipe(
			[installedDirectory, DPath.declarePath("duplojs-http/SKILL.md")] as const,
			DPath.resolveRelative,
			DSFile.exists,
			DEither.unwrapByInformationOrThrow("file-system-exists"),
		);
		expect(installedEntries).toEqual(["duplojs-http", "existing.txt"]);
		expect(existingContent).toBe("keep this file");
		expect(installedSkill).toBeUndefined();
	});

	it.each([
		["install", "unknown"],
		["install", "http", "--type", "unknown"],
	])("does not copy skills for invalid arguments %j", async(...args) => {
		const result = spawnSync("pnpm", ["exec", "duplojs-skills", ...args], {
			cwd: workspace,
			encoding: "utf8",
		});

		expect(result.error).toBeUndefined();
		expect(result.stderr).toContain("Command failed");
		const workspaceEntries = await DCommon.asyncPipe(
			workspace,
			DSFile.readDirectory,
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
		);
		expect(workspaceEntries).toEqual(["node_modules"]);
	});
});
