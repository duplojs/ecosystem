import * as DSCommand from "@duplojs/server/command";
import * as DSCommon from "@duplojs/server/common";
import * as DEither from "@duplojs/lang/either";
import { generateSummaryCommand } from "./generateSummary";
import { generateTableOfContentCommand } from "./generateTableOfContent";

const result = await DSCommand.exec(
	{
		subjects: [generateSummaryCommand, generateTableOfContentCommand],
	},
	() => {},
);

if (DEither.isLeft(result)) {
	DSCommon.exitProcess(1);
}
