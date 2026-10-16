import * as DSCommand from "@duplojs/server/command";
import * as DSCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";

const result = await DSCommand.execOptions([
	DSCommand.createOption("format", DDataStructure.literal(["json", "text"])),
	DSCommand.createBooleanOption("verbose"),
]);

if (DEither.isLeft(result)) {
	DSCommon.exitProcess(1);
} else if (DEither.hasInformation(result, "success")) {
	const options = DEither.unwrapRight(result);
	type _CheckOptions = DCommon.ExpectType<
		typeof options,
		{
			readonly format: "json" | "text" | undefined;
			readonly verbose: boolean;
		},
		"strict"
	>;

	console.log(options);
}
// La branche log-help ne déclenche aucun traitement après l'aide.
