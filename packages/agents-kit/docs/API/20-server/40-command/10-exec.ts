/**
 * @title DSCommand.exec
 *
 * Lire les arguments du processus, valider une commande racine et exécuter son traitement.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DSCommand from "@duplojs/server/command";

declare function generate(source: string, format: "json" | "text"): Promise<void>;

const result = await DSCommand.exec(
	{
		displayName: "generator",
		subjects: [
			DSCommand.createArgument(
				"source",
				DDataStructure.string(),
			),
		],
		options: [
			DSCommand.createOption(
				"format",
				DDataStructure.literal(["json", "text"]),
				{ required: true },
			),
		],
	},
	async({ args, options }) => {
		type _CheckFormat = DCommon.ExpectType<
			typeof options.format,
			"json" | "text",
			"strict"
		>;

		await generate(args.source, options.format);
	},
);

if (DEither.isLeft(result)) {
	// Le parsing invalide empêche le callback ; exec affiche le diagnostic.
	const error = DEither.unwrapLeft(result);
}

// Pour un fichier cli.ts exécuté avec tsx :
// tsx cli.ts ./source --format=json
// Ici exec définit directement la commande racine : aucun nom de
// sous-commande ne précède l'argument source.
// Les noms d'options doivent être uniques dans la commande. subjects
// contient soit des arguments positionnels, soit des sous-commandes.
