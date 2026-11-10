/**
 * @title DSCommand.execOptions
 *
 * Décoder les options du processus sans déclarer de commande positionnelle.
 */
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";

const result = await DSCommand.execOptions([
	DSCommand.createOption(
		"format",
		DDataStructure.literal(["json", "text"]),
	),
	DSCommand.createBooleanOption("verbose"),
]);

if (DEither.hasInformation(result, "success")) {
	const options = DEither.unwrapRight(result);

	type _CheckFormat = DCommon.ExpectType<
		typeof options.format,
		"json" | "text" | undefined,
		"strict"
	>;
}

// L'aide est également un Right, identifié par log-help ; une erreur est
// affichée puis renvoyée dans un Left.
