/**
 * @title DSCommand.create
 *
 * Construire une commande nommée à placer dans un arbre de commandes.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommand from "@duplojs/server/command";

declare function inspect(source: string): Promise<void>;

const inspectCommand = DSCommand.create(
	"inspect",
	{
		description: "Inspect a resource",
		subjects: [
			DSCommand.createArgument(
				"source",
				DDataStructure.string(),
			),
		],
	},
	async({ args }) => {
		await inspect(args.source);
	},
);

const result = await DSCommand.exec(
	{ subjects: [inspectCommand] },
	() => {},
);

// La sous-commande sélectionnée exécute son callback sans exécuter celui du parent.

// Exemple avec un fichier cli.ts exécuté par tsx :
// tsx cli.ts inspect ./resources
// « inspect » sélectionne la sous-commande, puis source reçoit ./resources.
// Un tableau subjects contient des arguments OU des sous-commandes : ces
// deux catégories ne peuvent pas être mélangées dans une même commande.
// Les options du parent ne sont pas héritées par les sous-commandes.
