import { directoryToMarkdown, HeadingLevelExceededError } from "../../../bin/generateSummary/directoryToMarkdown";
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";

const inputPathFolder = DPath.declareAbsolutePath("/docs");
const outputPathFolderFile = DPath.declareAbsolutePath("/output");
const files = ["index.md", "01-guide.md", "10-example.ts"] as const;
type WalkEntry = DSFile.FileInterface<string & DPath.Absolute> | DSFile.FolderInterface<string & DPath.Absolute>;

describe("directoryToMarkdown ignore", () => {
	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			pattern: [],
			expectedFiles: files,
			expectedFolders: ["/docs", "/docs/10-child", "/docs/20-ignored"],
		},
		{
			pattern: "*.ts",
			expectedFiles: ["index.md", "01-guide.md"],
			expectedFolders: ["/docs", "/docs/10-child", "/docs/20-ignored"],
		},
		{
			pattern: "index.md",
			expectedFiles: ["01-guide.md", "10-example.ts"],
			expectedFolders: ["/docs", "/docs/10-child", "/docs/20-ignored"],
		},
		{
			pattern: "20-ignored",
			expectedFiles: files,
			expectedFolders: ["/docs", "/docs/10-child"],
		},
		{
			pattern: "*",
			expectedFiles: [],
			expectedFolders: ["/docs"],
		},
	])("skips matching entries before reading or recursing for $pattern", async({ pattern, expectedFiles, expectedFolders }) => {
		const walkDirectory = vi.fn((path: string & DPath.Path) => {
			const entries: readonly WalkEntry[] = DArray.map(
				files,
				(name) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(`${path}/${name}`)),
			);
			const folders = path === inputPathFolder
				? DArray.map(["10-child", "20-ignored"], (name) => DSFile.createFolderInterface(DPath.createAbsoluteOrThrow(`${path}/${name}`)))
				: [];
			const iterator = DGenerator.concat(entries, folders);

			return Promise.resolve(DEither.right("file-system-walk-directory", iterator));
		});
		const readTextFile = vi.fn((path: string & DPath.Path) => Promise.resolve(DEither.right(
			"file-system-read-text-file",
			DPath.getExtensionName(path) === "ts"
				? `/**\n * @title ${path}\n */\nconst value = 1;`
				: `# ${path}`,
		)));
		TESTImplementation.set("walkDirectory", walkDirectory);
		TESTImplementation.set("readTextFile", readTextFile);
		const isIgnore = vi.fn(DPath.createMatcher(pattern));

		const result = await directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore,
		});
		const content = DEither.unwrapByInformationOrThrow(result, "render-success");

		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Left<"file-system-walk-directory-error", DSFile.WalkDirectoryErrors> | DEither.Right<"render-success", string>, "strict">;

		expect(walkDirectory).toHaveBeenCalledTimes(expectedFolders.length);
		expect(readTextFile).toHaveBeenCalledTimes(expectedFolders.length * expectedFiles.length);
		for (const folder of expectedFolders) {
			expect(walkDirectory).toHaveBeenCalledWith(folder);
			for (const file of expectedFiles) {
				const path = `${folder}/${file}`;
				expect(isIgnore).toHaveBeenCalledWith(path);
				expect(readTextFile).toHaveBeenCalledWith(path);
				expect(content).toContain(path);
			}
		}
	});

	it.each([
		{
			index: "# Domain",
			expected: "## [Example]",
		},
		{
			index: "## Domain",
			expected: "### [Example]",
		},
		{
			index: "### Domain",
			expected: "#### [Example]",
		},
		{
			index: "#### Domain",
			expected: "##### [Example]",
		},
		{
			index: "##### Domain",
			expected: "###### [Example]",
		},
	])("places entries below the index heading: $index", async({ index, expected }) => {
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(["/docs/index.md", "/docs/10-example.ts"], (path) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(path))),
		)));
		TESTImplementation.set("readTextFile", (path) => Promise.resolve(DEither.right(
			"file-system-read-text-file",
			path === "/docs/index.md" ? index : "/**\n * @title Example\n */",
		)));

		const result = await directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore: DPath.createMatcher([]),
		});
		expect(DEither.unwrapByInformationOrThrow(result, "render-success")).toContain(expected);
	});

	it("links to detailed index content without including it in the summary", async() => {
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(["/docs/index.md"], (path) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(path))),
		)));
		TESTImplementation.set("readTextFile", () => Promise.resolve(DEither.right(
			"file-system-read-text-file",
			"## Guide\n\nIntroduction.\n\n---\n\nDetailed explanation.",
		)));

		const result = await directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore: DPath.createMatcher([]),
		});
		const content = DEither.unwrapByInformationOrThrow(result, "render-success");
		expect(content).toContain("## [Guide](../docs/index.md)");
		expect(content).toContain("Introduction.");
		expect(content).not.toContain("Detailed explanation.");
	});

	it("rejects entries below heading level six", async() => {
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(["/docs/index.md", "/docs/10-example.ts"], (path) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(path))),
		)));
		TESTImplementation.set("readTextFile", (path) => Promise.resolve(DEither.right(
			"file-system-read-text-file",
			path === "/docs/index.md" ? "###### Domain" : "/**\n * @title Example\n */",
		)));

		const result = directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore: DPath.createMatcher([]),
		});

		await expect(result).rejects.toThrow(HeadingLevelExceededError);
		await expect(result).rejects.toThrow("Cannot generate a heading below level 6 in /docs");
	});

	it("derives nested heading levels from their parent indexes", async() => {
		TESTImplementation.set("walkDirectory", (path) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			path === "/docs"
				? DGenerator.concat([DSFile.createFileInterface(DPath.declareAbsolutePath("/docs/index.md"))], [DSFile.createFolderInterface(DPath.declareAbsolutePath("/docs/10-child"))])
				: DGenerator.map(["/docs/10-child/index.md", "/docs/10-child/10-example.ts"], (value) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(value))),
		)));
		TESTImplementation.set("readTextFile", (path) => {
			if (path === "/docs/index.md") {
				return Promise.resolve(DEither.right("file-system-read-text-file", "## Parent"));
			}
			if (path === "/docs/10-child/index.md") {
				return Promise.resolve(DEither.right("file-system-read-text-file", "# Child"));
			}
			return Promise.resolve(DEither.right("file-system-read-text-file", "/**\n * @title Example\n */"));
		});

		const result = await directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore: DPath.createMatcher([]),
		});
		const content = DEither.unwrapByInformationOrThrow(result, "render-success");
		expect(content).toContain("### Child");
		expect(content).toContain("#### [Example]");
	});

	it("retains the root heading of an indexed child when its parent has no index", async() => {
		TESTImplementation.set("walkDirectory", (path) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			path === "/docs"
				? DGenerator.map(["/docs/10-child"], (value) => DSFile.createFolderInterface(DPath.createAbsoluteOrThrow(value)))
				: DGenerator.map(["/docs/10-child/index.md"], (value) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(value))),
		)));
		TESTImplementation.set("readTextFile", () => Promise.resolve(DEither.right("file-system-read-text-file", "# Domain")));

		const result = await directoryToMarkdown({
			inputPathFolder,
			outputPathFolderFile,
			isIgnore: DPath.createMatcher([]),
		});
		expect(DEither.unwrapByInformationOrThrow(result, "render-success")).toContain("# Domain");
		expect(DEither.unwrapByInformationOrThrow(result, "render-success")).not.toContain("## Domain");
	});
});
