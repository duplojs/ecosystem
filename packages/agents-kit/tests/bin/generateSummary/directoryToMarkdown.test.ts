import { directoryToMarkdown } from "../../../bin/generateSummary/directoryToMarkdown";
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
});
