import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import { directoryToMarkdown } from "./directoryToMarkdown";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DCommon from "@duplojs/lang/common";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DString from "@duplojs/lang/string";

export const generateSummaryCommand = DSCommand.create(
	"generate-summary",
	{
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
					description: "file path output",
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
		const result = DEither.unwrapRightOrThrow(
			await directoryToMarkdown({
				isIgnore: DPath.createMatcher(options.ignore ?? []),
				inputPathFolder: DPath.resolveFrom(
					DSCommon.getCurrentWorkDirectoryOrThrow(),
					[options.input.path],
				),
				outputPathFolderFile: DPath.resolveFrom(
					DSCommon.getCurrentWorkDirectoryOrThrow(),
					[options.output, DCommon.cast("..")],
				),
			}),
		);

		await DSFile.writeTextFile(options.output, result);
	},
);
