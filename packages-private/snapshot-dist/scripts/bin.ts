#!/usr/bin/env -S tsx
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DCommon from "@duplojs/lang/common";
import * as DSDataStructure from "@duplojs/server/dataStructure";

// use: duplojs-snapshot-dist --inputPattern packages/**/dist/ --output docs/libs/v1

await DSCommand.exec(
	{
		displayName: "DuploJS Snapshot Dist CLI",
		options: [
			DSCommand.createOption(
				"output",
				DSDataStructure.folder([DSDataStructure.folderExist()]),
				{
					required: true,
				},
			),
			DSCommand.createArrayOption(
				"inputPattern",
				DDataStructure.string(),
				{
					required: true,
					min: 1,
					separator: ",",
					description: "path pattern list",
				},
			),
		],
	},
	() => {},
);
