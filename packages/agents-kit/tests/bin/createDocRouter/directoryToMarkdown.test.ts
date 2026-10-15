import { directoryToMarkdown } from "@scripts/bin/createDocRouter/directoryToMarkdown";
import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import * as DObject from "@duplojs/lang/object";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";

const params = {
	inputPathFolder: DPath.createAbsoluteOrThrow("/project/source"),
	outputPathFolderFile: DPath.createAbsoluteOrThrow("/project/docs"),
};

describe("directoryToMarkdown", () => {
	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("renders introductions, linked summaries, examples and numbered subdirectories", async() => {
		const contents: Record<string, string> = {
			"index.md": "# Documentation",
			"00-intro.md": "## Introduction\n---\nFull content",
			"10-guide.md": "## Guide\nSummary\n---\nDetailed guide",
			"20-note.md": "## Note\nFull note",
			"00-inline.ts": "/**\n * @title Inline\n * Description\n */\nconst value = 1;\n",
			"10-linked.ts": "/**\n * @title Linked\n * Description\n */\nconst value = 2;\n",
			"00-plain": "/** @title Plain */\nplain example\n",
			"30-empty.ts": "",
			"40-no-comment.ts": "const value = 3;",
			"50-no-header.ts": "/* @title Not JSDoc */",
			"60-empty-header.ts": "/***/",
			"README.md": "Ignored markdown",
			"example.ts": "Ignored example",
		};
		const files = DCommon.pipe(
			contents,
			DObject.keys,
			DArray.map((name) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(`/project/source/${name}`))),
		);
		const entries = [
			...files,
			DSFile.createFolderInterface(DPath.createAbsoluteOrThrow("/project/source/01-nested")),
			DSFile.createFolderInterface(DPath.createAbsoluteOrThrow("/project/source/ignored")),
			DSFile.createFolderInterface(DPath.createAbsoluteOrThrow("/")),
			DSFile.createUnknownEntryInterface(DPath.createAbsoluteOrThrow("/project/source/link")),
		];
		const walkDirectory = vi.fn((path: string) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(
				path === params.inputPathFolder
					? entries
					: [DSFile.createFileInterface(DPath.createAbsoluteOrThrow("/project/source/01-nested/index.md"))],
				DCommon.forward,
			),
		)));
		TESTImplementation.set("walkDirectory", walkDirectory);
		TESTImplementation.set("readTextFile", (path) => Promise.resolve(DEither.right("file-system-read-text-file", contents[DPath.getBaseName(path)!]!)));

		const result = await directoryToMarkdown(params);
		const content = DEither.unwrapByInformationOrThrow(result, "render-success");

		type _CheckResult = DCommon.ExpectType<typeof result, DEither.Left<"file-system-walk-directory-error", DSFile.WalkDirectoryErrors> | DEither.Right<"render-success", string>, "strict">;
		for (const section of [
			"# Documentation\n",
			"## Introduction\n---\nFull content\n",
			"## [Guide](../source/10-guide.md)\nSummary\n\n",
			"## Note\nFull note\n",
			"### Inline\nDescription\n",
			"```ts\nconst value = 1;\n```",
			"### [Linked](../source/10-linked.ts)\nDescription\n",
			"### Plain",
			"```txt\nplain example\n```",
		]) {
			expect(content).toContain(section);
		}
		for (const ignored of ["Detailed guide", "const value = 2;", "const value = 3;", "Not JSDoc", "Ignored markdown", "Ignored example"]) {
			expect(content).not.toContain(ignored);
		}
		expect(walkDirectory).toHaveBeenCalledTimes(2);
		expect(walkDirectory).toHaveBeenNthCalledWith(2, "/project/source/01-nested");
	});

	it("renders an empty directory", async() => {
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right("file-system-walk-directory", DGenerator.map([], DCommon.forward))));

		const result = DEither.unwrapByInformationOrThrow(await directoryToMarkdown(params), "render-success");

		expect(result).toBe("");
	});

	it("returns an error when the input directory cannot be read", async() => {
		class WalkError extends DCommon.DuploJSError.parentClass("file-system-walk-directory-error", Error) {}
		const failure = new WalkError(new Error("Read denied"));
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.left("file-system-walk-directory-error", failure)));

		const result = DEither.unwrapByInformationOrThrow(await directoryToMarkdown(params), "file-system-walk-directory-error");

		expect(result).toBe(failure);
	});
});
