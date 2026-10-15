import { execFileSync, spawnSync } from "node:child_process";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSFile from "@duplojs/server/file";

const integrationsDirectory = DPath.createOrThrow(import.meta.dirname);
const packageDirectory = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("..")]);
const workspace = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("test-output.generate/setup project with spaces")]);
const start = "<!-- duplojs-agents-kit:coding-conventions:start -->";
const stop = "<!-- duplojs-agents-kit:coding-conventions:stop -->";

describe.each([
	{
		type: "default",
		args: [],
		fileName: "AGENTS.md",
		otherFileName: "CLAUDE.md",
	},
	{
		type: "claude",
		args: ["--type", "claude"],
		fileName: "CLAUDE.md",
		otherFileName: "AGENTS.md",
	},
])("setup $type integration", ({ type, args, fileName, otherFileName }) => {
	const targetPath = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(fileName)]);
	const otherPath = DPath.resolveRelative([workspace, DPath.createSegmentOrThrow(otherFileName)]);

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

	it("creates the selected file through the published command and remains stable on reruns", async() => {
		await DCommon.asyncPipe(
			otherPath,
			DSFile.writeTextFile("Keep the other agent's instructions."),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "setup", ...args], { cwd: workspace });

		const firstContent = await DCommon.asyncPipe(
			targetPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(firstContent).toContain("../../..");
		expect(firstContent).not.toContain(packageDirectory);
		expect(firstContent).not.toContain("{{packagePath}}");

		expect(firstContent).toMatchSnapshot();

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "setup", "--type", type], { cwd: workspace });

		const secondContent = await DCommon.asyncPipe(
			targetPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(secondContent).toBe(firstContent);

		const otherContent = await DCommon.asyncPipe(
			otherPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(otherContent).toBe("Keep the other agent's instructions.");
	});

	it("updates an obsolete block while preserving surrounding project instructions", async() => {
		await DCommon.asyncPipe(
			targetPath,
			DSFile.writeTextFile(`# Project\n\n${start}\nObsolete instructions\n${stop}\n\nKeep these instructions.\n`),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "setup", ...args], { cwd: workspace });

		const content = await DCommon.asyncPipe(
			targetPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(content).toContain("../../..");
		expect(content).not.toContain(packageDirectory);
		expect(content).not.toContain("{{packagePath}}");

		expect(content).toMatchSnapshot();
	});

	it("exits with code 1 for incomplete markers and preserves the file", async() => {
		const initialContent = `${start}\nMissing stop marker\n`;
		await DCommon.asyncPipe(
			targetPath,
			DSFile.writeTextFile(initialContent),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);

		const result = spawnSync("pnpm", ["exec", "duplojs-agents-kit", "setup", ...args], {
			cwd: workspace,
			encoding: "utf8",
		});

		expect(result.error).toBeUndefined();
		expect(result.status).toBe(1);
		expect(result.stderr).toContain("invalid markers");
		const content = await DCommon.asyncPipe(
			targetPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(content).toBe(initialContent);
	});

	it("exits with code 1 when the destination is a directory", async() => {
		await DCommon.asyncPipe(
			targetPath,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);

		const result = spawnSync("pnpm", ["exec", "duplojs-agents-kit", "setup", ...args], {
			cwd: workspace,
			encoding: "utf8",
		});

		expect(result.error).toBeUndefined();
		expect(result.status).toBe(1);
		expect(result.stderr).not.toBe("");
	});
});
