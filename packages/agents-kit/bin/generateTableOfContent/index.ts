import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DSCommand from "@duplojs/server/command";
import * as DSCommon from "@duplojs/server/common";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DSFile from "@duplojs/server/file";
import { directoryToTableOfContent } from "./directoryToTableOfContent";

export const generateTableOfContentCommand = DSCommand.create(
	"generate-table-of-content",
	{
		description: "generate a table of contents linking to LLM summaries",
		options: [
			DSCommand.createOption(
				"input",
				DSDataStructure.folder([DSDataStructure.folderExist()]),
				{
					required: true,
					description: "documentation folder path",
				},
			),
			DSCommand.createOption(
				"output",
				DDataStructure.string([
					DDataStructure.path(),
					DDataStructure.refine(DString.endsWith(".llms.md")),
				]),
				{
					required: true,
					description: "table of contents output file path",
				},
			),
			DSCommand.createArrayOption(
				"ignore",
				DDataStructure.string(),
				{
					description: "path pattern to ignore",
				},
			),
		],
	},
	async({ options }) => {
		const currentWorkDirectory = DSCommon.getCurrentWorkDirectoryOrThrow();
		const outputPathFile = DPath.resolveFrom(currentWorkDirectory, [options.output]);
		const isIgnore = DPath.createMatcher(options.ignore ?? []);
		const content = DEither.unwrapRightOrThrow(
			await directoryToTableOfContent({
				inputPathFolder: DPath.resolveFrom(currentWorkDirectory, [options.input.path]),
				outputPathFolderFile: DPath.resolveFrom(outputPathFile, [DPath.declarePath("..")]),
				isIgnore: (path) => path === outputPathFile || isIgnore(path),
			}),
		);

		DEither.unwrapRightOrThrow(
			await DSFile.writeTextFile(outputPathFile, content ? `${content}\n` : ""),
		);
	},
);
