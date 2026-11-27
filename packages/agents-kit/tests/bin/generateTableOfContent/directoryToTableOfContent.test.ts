import { directoryToTableOfContent } from "../../../bin/generateTableOfContent/directoryToTableOfContent";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";

describe("directoryToTableOfContent", () => {
	beforeEach(() => setEnvironment("TEST"));
	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("stops at an indexed summary instead of listing its children", async() => {
		const walk = vi.fn(() => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.concat(
				DGenerator.map(["/docs/index.md", "/docs/index.llms.md"], (path) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(path))),
				[DSFile.createFolderInterface(DPath.declareAbsolutePath("/docs/10-child"))],
			),
		)));
		TESTImplementation.set("walkDirectory", walk);
		TESTImplementation.set("readTextFile", () => Promise.resolve(DEither.right("file-system-read-text-file", "## Client\n\nDescription.")));

		const result = await directoryToTableOfContent({
			inputPathFolder: DPath.declareAbsolutePath("/docs"),
			outputPathFolderFile: DPath.declareAbsolutePath("/output"),
			isIgnore: DPath.createMatcher([]),
		});
		expect(DEither.unwrapByInformationOrThrow(result, "render-success")).toContain("## [Client](../docs/index.llms.md)");
		expect(walk).toHaveBeenCalledTimes(1);
	});

	it("continues through a grouping index without a summary", async() => {
		const walk = vi.fn((path: string & DPath.Path) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			path === "/docs"
				? DGenerator.concat(
					[DSFile.createFileInterface(DPath.declareAbsolutePath("/docs/index.md"))],
					[DSFile.createFolderInterface(DPath.declareAbsolutePath("/docs/10-child"))],
				)
				: DGenerator.map(
					["/docs/10-child/index.md", "/docs/10-child/index.llms.md"],
					(value) => DSFile.createFileInterface(DPath.createAbsoluteOrThrow(value)),
				),
		)));
		TESTImplementation.set("walkDirectory", walk);
		TESTImplementation.set("readTextFile", (path) => Promise.resolve(DEither.right(
			"file-system-read-text-file",
			path === "/docs/index.md" ? "## Vue" : "### Layouts",
		)));

		const result = await directoryToTableOfContent({
			inputPathFolder: DPath.declareAbsolutePath("/docs"),
			outputPathFolderFile: DPath.declareAbsolutePath("/output"),
			isIgnore: DPath.createMatcher([]),
		});
		const content = DEither.unwrapByInformationOrThrow(result, "render-success");
		expect(content).toContain("## Vue");
		expect(content).toContain("### [Layouts](../docs/10-child/index.llms.md)");
		expect(walk).toHaveBeenCalledTimes(2);
	});
});
