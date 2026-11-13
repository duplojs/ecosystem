import { execFileSync, spawnSync } from "node:child_process";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DString from "@duplojs/lang/string";

const integrationsDirectory = DPath.createAbsoluteOrThrow(import.meta.dirname);
const skillsDirectory = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("../skills")]);
const workspace = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("test-output.generate/project with spaces")]);

// Un inventaire partagé couvre les nouveaux skills sans multiplier les scénarios.
const allSkills: readonly string[] = await DCommon.asyncPipe(
	DSFile.readDirectory(skillsDirectory),
	DEither.unwrapByInformationOrThrow("file-system-read-directory"),
);

describe("skills integration", () => {
	beforeEach(async() => {
		await DCommon.asyncPipe(
			workspace,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);
		const sourceModules = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("node_modules")]);
		const targetModules = DPath.resolveRelative([workspace, DPath.declarePath("node_modules")]);
		await DCommon.asyncPipe(
			DSFile.symlink(sourceModules, targetModules, { type: "directory" }),
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
		[["skills", "install", "fundamental"], ".agents", ["fundamental"], true],
		[["skills", "install", "http-server", "--copy"], ".agents", ["http-server"], false],
		[["skills", "install", "http-server", "--type", "claude", "--copy"], ".claude", ["http-server"], false],
		[["skills", "install", "fundamental", "--type", "codex"], ".codex", ["fundamental"], true],
		[["skills", "install"], ".agents", allSkills, true],
		[["skills", "install", "--copy"], ".agents", allSkills, false],
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
			const sourceDirectory = DPath.resolveRelative([skillsDirectory, DPath.createSegmentOrThrow(skill)]);
			const destinationDirectory = DPath.resolveRelative([installedDirectory, DPath.createSegmentOrThrow(`duplojs-${skill}`)]);
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
				expect(target).toBe(DPath.computeRelative(installedDirectory, sourceDirectory));
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

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "install", "http-server", "--type", agent], { cwd: workspace });

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
			[installedDirectory, DPath.declarePath("duplojs-http-server/SKILL.md")] as const,
			DPath.resolveRelative,
			DSFile.exists,
			DEither.unwrapByInformationOrThrow("file-system-exists"),
		);
		expect(installedEntries).toEqual(["duplojs-http-server", "existing.txt"]);
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
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "install", "http-server", ...initialOptions], { cwd: workspace });
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "install", "http-server", ...options], { cwd: workspace });

		const destination = DPath.resolveRelative([workspace, DPath.declarePath(".agents/skills/duplojs-http-server")]);
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
		const destination = DPath.resolveRelative([workspace, DPath.declarePath(".agents/skills/duplojs-http-server")]);
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

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "install", "http-server", ...options], { cwd: workspace });

		const installedStat = await DCommon.asyncPipe(
			destination,
			DSFile.linkStat,
			DEither.unwrapByInformationOrThrow("file-system-link-stat"),
		);
		const source = DPath.resolveRelative([skillsDirectory, DPath.declarePath("http-server")]);
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
		const destination = DPath.resolveRelative([skillsFolder, DPath.declarePath("duplojs-http-server")]);
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
			DSFile.symlink(linkTarget, destination, { type: "directory" }),
			DEither.unwrapByInformationOrThrow("file-system-symlink"),
		);

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "install", "http-server", ...options], { cwd: workspace });

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
		const sourceFile = DPath.resolveRelative([skillsDirectory, DPath.declarePath("http-server/SKILL.md")]);
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
		["skills", "install", "unknown"],
		["skills", "install", "http-server", "--type", "unknown"],
		["skills", "install", "http-server", "--copy=false"],
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

	it.each([
		{
			agent: "default",
			folder: ".agents",
			target: "previous-package",
		},
		{
			agent: "default",
			folder: ".agents",
			target: "missing-package",
		},
		{
			agent: "codex",
			folder: ".codex",
			target: "previous-package",
		},
		{
			agent: "codex",
			folder: ".codex",
			target: "missing-package",
		},
		{
			agent: "claude",
			folder: ".claude",
			target: "previous-package",
		},
		{
			agent: "claude",
			folder: ".claude",
			target: "missing-package",
		},
	])("updates $agent links to $target and copied skills while preserving other entries and link targets", async({ agent, folder, target }) => {
		const installedDirectory = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(folder), DPath.declarePath("skills")]);
		const previousDirectory = DPath.resolveRelative([workspace, DPath.declarePath("previous-package")]);
		const previousFile = DPath.resolveRelative([previousDirectory, DPath.declarePath("SKILL.md")]);
		const copiedDirectory = DPath.resolveRelative([installedDirectory, DPath.declarePath("duplojs-http-client")]);
		const copiedFile = DPath.resolveRelative([copiedDirectory, DPath.declarePath("SKILL.md")]);
		const obsoleteFile = DPath.resolveRelative([copiedDirectory, DPath.declarePath("obsolete.txt")]);
		for (const directory of [installedDirectory, previousDirectory, copiedDirectory]) {
			await DCommon.asyncPipe(DSFile.ensureDirectory(directory), DEither.unwrapByInformationOrThrow("file-system-ensure-directory"));
		}
		for (const file of [previousFile, copiedFile, obsoleteFile]) {
			await DCommon.asyncPipe(DSFile.writeTextFile(file, "preserve this content"), DEither.unwrapByInformationOrThrow("file-system-write-text-file"));
		}
		const previousTarget = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(target)]);
		const missingTarget = DPath.resolveRelative([workspace, DPath.declarePath("missing-package")]);
		const currentTarget = DPath.resolveRelative([skillsDirectory, DPath.declarePath("command")]);
		for (const [name, source] of [
			["duplojs-fundamental", previousTarget],
			["duplojs-command", currentTarget],
			["duplojs-unknown", missingTarget],
			["another-skill", missingTarget],
		] as const) {
			const destination = DPath.resolveRelative([installedDirectory, DPath.createSegmentOrThrow(name)]);
			await DCommon.asyncPipe(DSFile.symlink(source, destination, { type: "directory" }), DEither.unwrapByInformationOrThrow("file-system-symlink"));
		}

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "update", "--type", agent], { cwd: workspace });

		const entries = await DCommon.asyncPipe(
			DSFile.readDirectory(installedDirectory),
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
			DString.sort("ASC"),
		);
		expect(entries).toEqual(["another-skill", "duplojs-command", "duplojs-fundamental", "duplojs-http-client", "duplojs-unknown"]);
		for (const skill of ["fundamental", "command"]) {
			const destination = DPath.resolveRelative([installedDirectory, DPath.createSegmentOrThrow(`duplojs-${skill}`)]);
			const source = DPath.resolveRelative([skillsDirectory, DPath.createSegmentOrThrow(skill)]);
			const link = await DCommon.asyncPipe(DSFile.readLink(destination), DEither.unwrapByInformationOrThrow("file-system-read-link"));
			expect(link).toBe(DPath.computeRelative(installedDirectory, source));
			const skillFile = DPath.resolveRelative([destination, DPath.declarePath("SKILL.md")]);
			const exists = await DCommon.asyncPipe(DSFile.exists(skillFile), DEither.unwrapByInformationOrThrow("file-system-exists"));
			expect(exists).toBeUndefined();
		}
		const previousContent = await DCommon.asyncPipe(DSFile.readTextFile(previousFile), DEither.unwrapByInformationOrThrow("file-system-read-text-file"));
		expect(previousContent).toBe("preserve this content");
		const copiedStat = await DCommon.asyncPipe(DSFile.linkStat(copiedDirectory), DEither.unwrapByInformationOrThrow("file-system-link-stat"));
		expect(copiedStat.isSymlink).toBe(false);
		expect(copiedStat.isDirectory).toBe(true);
		const sourceDirectory = DPath.resolveRelative([skillsDirectory, DPath.declarePath("http-client")]);
		const sourceFile = DPath.resolveRelative([sourceDirectory, DPath.declarePath("SKILL.md")]);
		const copiedContent = await DCommon.asyncPipe(DSFile.readTextFile(copiedFile), DEither.unwrapByInformationOrThrow("file-system-read-text-file"));
		const sourceContent = await DCommon.asyncPipe(DSFile.readTextFile(sourceFile), DEither.unwrapByInformationOrThrow("file-system-read-text-file"));
		expect(copiedContent).toBe(sourceContent);
		const copiedEntries = await DCommon.asyncPipe(DSFile.readDirectory(copiedDirectory, { recursive: true }), DEither.unwrapByInformationOrThrow("file-system-read-directory"), DString.sort("ASC"));
		const sourceEntries = await DCommon.asyncPipe(DSFile.readDirectory(sourceDirectory, { recursive: true }), DEither.unwrapByInformationOrThrow("file-system-read-directory"), DString.sort("ASC"));
		expect(copiedEntries).toEqual(sourceEntries);
		expect(copiedEntries).not.toContain("obsolete.txt");
		for (const name of ["duplojs-unknown", "another-skill"]) {
			const destination = DPath.resolveRelative([installedDirectory, DPath.createSegmentOrThrow(name)]);
			const link = await DCommon.asyncPipe(DSFile.readLink(destination), DEither.unwrapByInformationOrThrow("file-system-read-link"));
			expect(link).toBe(missingTarget);
		}
	});

	it("skips absent skills without creating an agent folder", async() => {
		const result = spawnSync("pnpm", ["exec", "duplojs-agents-kit", "skills", "update"], { cwd: workspace });

		const entries = await DCommon.asyncPipe(DSFile.readDirectory(workspace), DEither.unwrapByInformationOrThrow("file-system-read-directory"));

		expect(result.error).toBeUndefined();
		expect(result.status).toBe(0);
		expect(entries).toEqual(["node_modules"]);
	});
});
