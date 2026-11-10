/**
 * @title DSCommand.createOption
 *
 * Déclarer une option à valeur décodée par une data structure.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";

const command = DSCommand.create(
	"generate",
	{
		options: [
			DSCommand.createOption(
				"format",
				DDataStructure.literal(["json", "text"]),
				{
					required: true,
					aliases: ["f"],
				},
			),
			DSCommand.createOption(
				"output",
				DDataStructure.string(),
			),
		],
	},
	({ options }) => {
		type _CheckFormat = DCommon.ExpectType<
			typeof options.format,
			"json" | "text",
			"strict"
		>;
		type _CheckOutput = DCommon.ExpectType<
			typeof options.output,
			string | undefined,
			"strict"
		>;
	},
);

// Une option présente sans valeur est invalide, même lorsqu'elle est facultative.

// Les noms et alias doivent éviter les collisions dans la commande ;
// help et h sont réservés à l’aide intégrée.
// Les formes --format=json, --format json et -f json sont acceptées.
