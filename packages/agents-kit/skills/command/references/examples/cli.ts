#!/usr/bin/env node

import * as DSCommand from "@duplojs/server/command";
import * as DSCommon from "@duplojs/server/common";
import * as DEither from "@duplojs/lang/either";
import { previewCommand } from "./preview-command";

const result = await DSCommand.exec(
	{
		displayName: "my-cli",
		description: "Preview application operations",
		subjects: [previewCommand],
	},
	() => {
		console.log("Use my-cli preview --help to inspect export parameters.");
	},
);

// Les diagnostics de validation ont déjà été affichés par exec.
if (DEither.isLeft(result)) {
	DSCommon.exitProcess(1);
}
