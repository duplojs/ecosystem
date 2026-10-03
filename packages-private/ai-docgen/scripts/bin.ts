#!/usr/bin/env -S tsx
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import { directoryToMarkdown } from "./directoryToMarkdown";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DCommon from "@duplojs/lang/common";

await DSCommand.exec(
	{
		options: [
			DSCommand.createOption(
				"input",
				DDataStructure.string([DDataStructure.path()]),
				{ required: true },
			),
			DSCommand.createOption(
				"output",
				DDataStructure.string([DDataStructure.path()]),
				{ required: true },
			),
		],
	},
	async({ options }) => {
		const result = DEither.unwrapRightOrThrow(
			await directoryToMarkdown({
				inputPathFolder: DPath.resolveFrom(
					DSCommon.getCurrentWorkDirectoryOrThrow(),
					[options.input],
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
