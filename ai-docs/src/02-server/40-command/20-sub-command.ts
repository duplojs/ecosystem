/**
 * @title Créer des sous-commandes
 *
 * Une commande peut utiliser d'autres commandes comme `subjects`.
 *
 * Cela permet de construire une arborescence de commandes, chaque
 * sous-commande pouvant elle-même contenir d'autres sous-commandes.
 *
 * Une commande qui contient des sous-commandes ne peut pas déclarer
 * d'arguments au même niveau.
 */
import * as DSCommand from "@duplojs/server/command";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const installCommand = DSCommand.create(
	"install",
	{
		description: "Install a package",
		options: [
			DSCommand.createBooleanOption(
				"yes",
				{
					aliases: ["y"],
					description: "Answer yes to prompts",
				},
			),
		],
		subjects: [
			DSCommand.createArgument(
				"packageName",
				DDataStructure.string(),
			),
		],
	},
	({ options, args: { packageName } }) => {
		console.log(
			`install ${packageName}${options.yes ? " without prompt" : ""}`,
		);
	},
);

// La commande parente référence directement ses sous-commandes
// dans ses `subjects`.
await DSCommand.exec(
	{
		description: "Package manager",
		subjects: [installCommand],
	},
	() => {
		console.log("select a package command");
	},
);
