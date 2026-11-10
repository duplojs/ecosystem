/**
 * @title DSCommand.createArgument
 *
 * Déclarer un argument positionnel validé et transmis à une commande.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";

const command = DSCommand.create(
	"generate",
	{
		subjects: [
			DSCommand.createArgument(
				"source",
				DDataStructure.string(),
			),
			DSCommand.createArgument(
				"destination",
				DDataStructure.string(),
				{ optional: true },
			),
		],
	},
	({ args }) => {
		// Les arguments facultatifs suivent les arguments obligatoires.
		type _CheckArgs = DCommon.ExpectType<
			typeof args,
			{
				readonly source: string;
				readonly destination: string | undefined;
			},
			"strict"
		>;
	},
);

// Dans subjects, les arguments facultatifs suivent les obligatoires.
// Le même tableau ne peut pas mélanger arguments et sous-commandes.
