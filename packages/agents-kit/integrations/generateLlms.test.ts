import { execFileSync, spawnSync } from "node:child_process";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DSFile from "@duplojs/server/file";

const integrationsDirectory = DPath.createOrThrow(import.meta.dirname);
const fixtureDirectory = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("fixtures/generateLlms/ai docs")]);
const workspace = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("test-output.generate/generate llms/project with spaces")]);
const inputDirectory = DPath.resolveRelative([workspace, DPath.declarePath("ai docs/src")]);
const outputDirectory = DPath.resolveRelative([workspace, DPath.declarePath("generated docs")]);
const outputFile = DPath.resolveRelative([outputDirectory, DPath.declarePath("LLMS.md")]);

describe("generate-llms integration", () => {
	beforeEach(async() => {
		await DCommon.asyncPipe(
			outputDirectory,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);
		const sourceModules = DPath.resolveRelative([integrationsDirectory, DPath.declarePath("node_modules")]);
		const targetModules = DPath.resolveRelative([workspace, DPath.declarePath("node_modules")]);
		await DCommon.asyncPipe(
			DSFile.symlink(sourceModules, targetModules, { type: "dir" }),
			DEither.unwrapByInformationOrThrow("file-system-symlink"),
		);
		const targetDocs = DPath.resolveRelative([workspace, DPath.declarePath("ai docs")]);
		await DCommon.asyncPipe(
			DSFile.symlink(fixtureDirectory, targetDocs, { type: "dir" }),
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
		{
			name: "relative paths with spaces",
			input: "ai docs/src",
			output: "generated docs/LLMS.md",
			linkPrefix: "../ai docs/src",
		},
		{
			name: "absolute paths with spaces",
			input: inputDirectory,
			output: outputFile,
			linkPrefix: "../ai docs/src",
		},
		{
			name: "output at the project root",
			input: "ai docs/src",
			output: "LLMS.md",
			linkPrefix: "ai docs/src",
		},
	])("generates a complete router using $name", async({ input, output, linkPrefix }) => {
		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "generate-llms", "--input", input, "--output", output], { cwd: workspace });

		const generatedPath = DPath.resolveRelative([workspace, DPath.createOrThrow(output)]);
		const content = await DCommon.asyncPipe(
			generatedPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		const expected = DString.join([
			"# Documentation\n",
			"## Introduction\n---\nFull introduction\n",
			`## [Guide](${linkPrefix}/10-guide with spaces.md)\nGuide summary\n\n`,
			"## Note\nFull note\n",
			"### Inline example\nInline summary\n```ts\nexport const inline = 1;\n```\n\n",
			`### [Linked example](${linkPrefix}/10-linked.ts)\nLinked summary\n`,
			"## Nested documentation\n",
			`### [Topic](${linkPrefix}/01-nested/10-topic.md)\nTopic summary\n\n`,
			"### Deep documentation\n",
		], "");

		expect(content).toBe(expected);
	});

	it("replaces an existing router when documentation changes", async() => {
		const mutableDirectory = DPath.resolveRelative([workspace, DPath.declarePath("mutable docs")]);
		await DCommon.asyncPipe(
			DSFile.copy(inputDirectory, mutableDirectory),
			DEither.unwrapByInformationOrThrow("file-system-copy"),
		);
		const args = ["exec", "duplojs-agents-kit", "generate-llms", "--input", "mutable docs", "--output", "generated docs/LLMS.md"];
		execFileSync("pnpm", args, { cwd: workspace });
		const indexPath = DPath.resolveRelative([mutableDirectory, DPath.declarePath("index.md")]);
		await DCommon.asyncPipe(
			indexPath,
			DSFile.writeTextFile("# Updated documentation"),
			DEither.unwrapByInformationOrThrow("file-system-write-text-file"),
		);

		execFileSync("pnpm", args, { cwd: workspace });

		const content = await DCommon.asyncPipe(
			outputFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		const source = await DCommon.asyncPipe(
			indexPath,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(content).toContain("# Updated documentation\n");
		expect(content).not.toContain("# Documentation\n");
		expect(source).toBe("# Updated documentation");
	});

	it("writes an empty router for an empty input directory", async() => {
		const emptyDirectory = DPath.resolveRelative([workspace, DPath.declarePath("empty docs")]);
		await DCommon.asyncPipe(
			emptyDirectory,
			DSFile.ensureDirectory,
			DEither.unwrapByInformationOrThrow("file-system-ensure-directory"),
		);

		execFileSync("pnpm", ["exec", "duplojs-agents-kit", "generate-llms", "--input", "empty docs", "--output", "generated docs/LLMS.md"], { cwd: workspace });

		const content = await DCommon.asyncPipe(
			outputFile,
			DSFile.readTextFile,
			DEither.unwrapByInformationOrThrow("file-system-read-text-file"),
		);
		expect(content).toBe("");
	});

	it.each([
		[],
		["--input", "ai docs/src"],
		["--output", "generated docs/LLMS.md"],
		["--input", "ai docs/src", "--output", ""],
		["--input", "missing docs", "--output", "generated docs/LLMS.md"],
		["--input", "ai docs/src/index.md", "--output", "generated docs/LLMS.md"],
	])("does not create a router for invalid options %j", async(...args) => {
		const result = spawnSync("pnpm", ["exec", "duplojs-agents-kit", "generate-llms", ...args], {
			cwd: workspace,
			encoding: "utf8",
		});

		expect(result.error).toBeUndefined();
		expect(result.stderr).toContain("Command failed");
		const outputEntries = await DCommon.asyncPipe(
			outputDirectory,
			DSFile.readDirectory,
			DEither.unwrapByInformationOrThrow("file-system-read-directory"),
		);
		expect(outputEntries).toEqual([]);
	});
});
