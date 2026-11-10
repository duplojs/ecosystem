/**
 * @title DSCommand.createArrayOption
 *
 * Déclarer une option contenant plusieurs valeurs décodées.
 */
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";

const command = DSCommand.create(
	"inspect",
	{
		options: [
			DSCommand.createArrayOption(
				"include",
				DDataStructure.string(),
				{
					required: true,
					min: 1,
				},
			),
		],
	},
	({ options }) => {
		// La liste obligatoire et sa borne minimale garantissent un premier élément.
		const first = DArray.first(options.include);
		type _CheckFirst = DCommon.ExpectType<
			typeof first,
			string,
			"strict"
		>;
	},
);

// Par défaut les éléments d'une valeur sont séparés par des virgules.
