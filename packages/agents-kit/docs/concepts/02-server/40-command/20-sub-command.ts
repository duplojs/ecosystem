/**
 * @title Créer des sous-commandes
 *
 * Composition de commandes sous forme d'arbre pour router l'exécution vers
 * une branche spécialisée.
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
// dans ses `subjects`. Une commande avec sous-commandes ne déclare pas
// d'arguments au même niveau.
await DSCommand.exec(
	{
		description: "Package manager",
		subjects: [installCommand],
	},
	() => {
		console.log("select a package command");
	},
);
