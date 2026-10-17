#!/usr/bin/env -S tsx
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import { snapshotDist } from "./snapshotDist";

await DSCommand.exec(
	{
		displayName: "duplojs-snapshot-dist",
		description: "Copy declaration files into existing snapshot package folders.",
		options: [
			DSCommand.createOption(
				"output",
				DSDataStructure.folder([DSDataStructure.folderExist()]),
				{
					required: true,
					description: "Existing version folder containing the snapshot packages.",
				},
			),
			DSCommand.createOption(
				"rootDir",
				DSDataStructure.folder([DSDataStructure.folderExist()]),
				{
					required: true,
					description: "Root folder in which input patterns are evaluated.",
				},
			),
			DSCommand.createArrayOption(
				"inputPattern",
				DDataStructure.string(),
				{
					required: true,
					min: 1,
					separator: ",",
					description: "Comma-separated folder patterns relative to rootDir. Quote shell wildcards.",
				},
			),
		],
	},
	async({ options }) => snapshotDist(options),
);
