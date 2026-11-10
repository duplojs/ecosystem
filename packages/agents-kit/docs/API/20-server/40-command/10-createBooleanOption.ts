/**
 * @title DSCommand.createBooleanOption
 *
 * Déclarer un flag représentant la présence d’une option.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DSCommand from "@duplojs/server/command";

const command = DSCommand.create(
	"inspect",
	{
		options: [
			DSCommand.createBooleanOption(
				"verbose",
				{ aliases: ["v"] },
			),
		],
	},
	({ options }) => {
		type _CheckVerbose = DCommon.ExpectType<
			typeof options.verbose,
			boolean,
			"strict"
		>;
	},
);

// Le flag vaut false si absent, true si présent ; il n'accepte pas de valeur.
