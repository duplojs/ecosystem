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
		[["install", "fundamental"], ".agents", ["fundamental"], true],
		[["install", "http"], ".agents", ["http"], true],
		[["install", "http", "--type", "default"], ".agents", ["http"], true],
		[["install", "fundamental", "--type", "claude"], ".claude", ["fundamental"], true],
		[["install", "http", "--type", "codex"], ".codex", ["http"], true],
		[["install"], ".agents", ["fundamental", "http"], true],
		[["install", "--type", "claude"], ".claude", ["fundamental", "http"], true],
		[["install", "--type", "codex"], ".codex", ["fundamental", "http"], true],
		[["install", "fundamental", "--copy"], ".agents", ["fundamental"], false],
		[["install", "http", "--copy"], ".agents", ["http"], false],
		[["install", "http", "--type", "claude", "--copy"], ".claude", ["http"], false],
		[["install", "fundamental", "--type", "codex", "--copy"], ".codex", ["fundamental"], false],
		[["install", "--copy"], ".agents", ["fundamental", "http"], false],
		[["install", "--type", "claude", "--copy"], ".claude", ["fundamental", "http"], false],
		[["install", "--type", "codex", "--copy"], ".codex", ["fundamental", "http"], false],
	] as const)("installs skills for %j into %s", async(args, agentFolder, skills, expectedSymlink) => {
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", ...args], { cwd: workspace });

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
			const destinationDirectory = DPath.resolveRelative([installedDirectory, DCommon.cast(`duplojs-${skill}`)]);
			const installedStat = await DCommon.asyncPipe(
				destinationDirectory,
				DSFile.linkStat,
				DEither.unwrapByInformationOrThrow("file-system-link-stat"),
			);
			expect(installedStat.isSymlink).toBe(expectedSymlink);
			if (expectedSymlink) {
				const target = await DCommon.asyncPipe(
					destinationDirectory,
					DSFile.readLink,
					DEither.unwrapByInformationOrThrow("file-system-read-link"),
				);
				expect(target).toBe(sourceDirectory);
			}
			const sourceEntries = await DCommon.asyncPipe(
				DSFile.readDirectory(sourceDirectory, { recursive: true }),
				DEither.unwrapByInformationOrThrow("file-system-read-directory"),
				DString.sort("ASC"),
			);
			const destinationEntries = await DCommon.asyncPipe(
				DSFile.readDirectory(destinationDirectory, { recursive: true }),
				DEither.unwrapByInformationOrThrow("file-system-read-directory"),
				DString.sort("ASC"),
			);
			expect(sourceEntries).toContain("SKILL.md");
			expect(destinationEntries).toEqual(sourceEntries);

			for (const entry of sourceEntries) {
				const sourcePath = DPath.resolveRelative([sourceDirectory, entry]);
				const destinationPath = DPath.resolveRelative([destinationDirectory, entry]);
				const sourceStat = await DCommon.asyncPipe(
					sourcePath,
					DSFile.stat,
					DEither.unwrapByInformationOrThrow("file-system-stat"),
				);
				const destinationStat = await DCommon.asyncPipe(
					destinationPath,
					DSFile.stat,
					DEither.unwrapByInformationOrThrow("file-system-stat"),
				);
				expect(destinationStat.isDirectory).toBe(sourceStat.isDirectory);

				if (sourceStat.isFile) {
					const sourceContent = await DCommon.asyncPipe(
						sourcePath,
						DSFile.readFile,
						DEither.unwrapByInformationOrThrow("file-system-read-file"),
					);
					const destinationContent = await DCommon.asyncPipe(
						destinationPath,
						DSFile.readFile,
						DEither.unwrapByInformationOrThrow("file-system-read-file"),
					);
					expect(destinationContent).toEqual(sourceContent);
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

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "install", "http", "--type", agent], { cwd: workspace });

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
		{
			initialOptions: [],
			options: [],
			expectedSymlink: true,
		},
		{
			initialOptions: ["--copy"],
			options: [],
			expectedSymlink: true,
		},
		{
			initialOptions: [],
			options: ["--copy"],
			expectedSymlink: false,
		},
		{
			initialOptions: ["--copy"],
			options: ["--copy"],
			expectedSymlink: false,
		},
	])("replaces an installation from $initialOptions with $options", async({ initialOptions, options, expectedSymlink }) => {
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "install", "http", ...initialOptions], { cwd: workspace });
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "install", "http", ...options], { cwd: workspace });

		const destination = DPath.resolveRelative([workspace, DPath.declarePath(".agents/skills/duplojs-http")]);
		const installedStat = await DCommon.asyncPipe(
			destination,
			DSFile.linkStat,
			DEither.unwrapByInformationOrThrow("file-system-link-stat"),
		);
		expect(installedStat.isSymlink).toBe(expectedSymlink);
	});

	it.each([
		{
			options: [],
			expectedSymlink: true,
		},
		{
			options: ["--copy"],
			expectedSymlink: false,
		},
	])("replaces an existing directory and removes obsolete files with $options", async({ options, expectedSymlink }) => {
		const destination = DPath.resolveRelative([workspace, DPath.declarePath(".agents/skills/duplojs-http")]);
		const obsoleteFile = DPath.resolveRelative([destination, DPath.declarePath("obsolete.txt")]);
		await DCommon.asyncPipe(
			destination,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);
		await DCommon.asyncPipe(
			obsoleteFile,
			DSFile.writeTextFile("obsolete content"),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "install", "http", ...options], { cwd: workspace });

		const installedStat = await DCommon.asyncPipe(
			destination,
			DSFile.linkStat,
			DEither.unwrapByInformationOrThrow("file-system-link-stat"),
		);
		const source = DPath.resolveRelative([skillsDirectory, DPath.declarePath("http")]);
		const sourceEntries = await DCommon.asyncPipe(
			DSFile.readDirectory(source, { recursive: true }),
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
			DString.sort("ASC"),
		);
		const destinationEntries = await DCommon.asyncPipe(
			DSFile.readDirectory(destination, { recursive: true }),
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
			DString.sort("ASC"),
		);
		expect(installedStat.isSymlink).toBe(expectedSymlink);
		expect(destinationEntries).toEqual(sourceEntries);
	});

	it.each([
		{
			previousTarget: "previous-http",
			options: [],
			expectedSymlink: true,
		},
		{
			previousTarget: "previous-http",
			options: ["--copy"],
			expectedSymlink: false,
		},
		{
			previousTarget: "missing-http",
			options: [],
			expectedSymlink: true,
		},
		{
			previousTarget: "missing-http",
			options: ["--copy"],
			expectedSymlink: false,
		},
	])("replaces a link to $previousTarget with $options and preserves its target", async({ previousTarget, options, expectedSymlink }) => {
		const skillsFolder = DPath.resolveRelative([workspace, DPath.declarePath(".agents/skills")]);
		const destination = DPath.resolveRelative([skillsFolder, DPath.declarePath("duplojs-http")]);
		const oldTarget = DPath.resolveRelative([workspace, DPath.declarePath("previous-http")]);
		const oldFile = DPath.resolveRelative([oldTarget, DPath.declarePath("SKILL.md")]);
		const linkTarget = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(previousTarget)]);
		for (const directory of [skillsFolder, oldTarget]) {
			await DCommon.asyncPipe(
				directory,
				DSFile.ensureDirectory,
				DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
			);
		}
		await DCommon.asyncPipe(
			oldFile,
			DSFile.writeTextFile("previous skill content"),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);
		await DCommon.asyncPipe(
			DSFile.symlink(linkTarget, destination, { type: "dir" }),
			DEither.unwrapByInformationOrThrow("file-system-symlink"),
		);

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "install", "http", ...options], { cwd: workspace });

		const installedStat = await DCommon.asyncPipe(
			destination,
			DSFile.linkStat,
			DEither.unwrapByInformationOrThrow("file-system-link-stat"),
		);
		const oldContent = await DCommon.asyncPipe(
			oldFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		const installedFile = DPath.resolveRelative([destination, DPath.declarePath("SKILL.md")]);
		const sourceFile = DPath.resolveRelative([skillsDirectory, DPath.declarePath("http/SKILL.md")]);
		const installedContent = await DCommon.asyncPipe(
			installedFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		const sourceContent = await DCommon.asyncPipe(
			sourceFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(installedStat.isSymlink).toBe(expectedSymlink);
		expect(oldContent).toBe("previous skill content");
		expect(installedContent).toBe(sourceContent);
	});

	it.each([
		["install", "unknown"],
		["install", "http", "--type", "unknown"],
		["install", "http", "--copy=false"],
	])("does not install skills for invalid arguments %j", async(...args) => {
		const result = spawnSync("pnpm", ["exec", "duplojs-agents-kit", ...args], {
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
