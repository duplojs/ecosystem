/**
 * @title Définir une commande
 *
 * Définition des entrées et du traitement d’une commande CLI.
 */
import * as DSCommand from "@duplojs/server/command";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Une commande simple peut uniquement déclarer les arguments
// dont elle a besoin.
// `exec` interprète les entrées selon leurs déclarations, puis transmet les
// valeurs typées au callback : les arguments dans `args`, les options dans `options`.
await DSCommand.exec(
	{
		description: "Display a greeting",
		subjects: [
			DSCommand.createArgument(
				"name",
				DDataStructure.string(),
			),
		],
	},
	({ args: { name } }) => {
		console.log(`Hello ${name}!`);
	},
);

// Une commande peut combiner plusieurs arguments et différentes
// formes d'options.
await DSCommand.exec(
	{
		description: "Copy files to a destination",
		options: [
			// Une option classique attend une valeur qui sera
			// interprétée avec sa `DataStructure`.
			DSCommand.createOption(
				"mode",
				DDataStructure.literal([
					"copy",
					"move",
				]),
				{
					aliases: ["m"],
					description: "Operation to perform",
				},
			),
			// Une option booléenne représente directement
			// la présence ou non du flag.
			DSCommand.createBooleanOption(
				"force",
				{
					aliases: ["f"],
					description: "Overwrite existing files",
				},
			),
			// Une option tableau permet de recevoir plusieurs
			// valeurs respectant une même `DataStructure`.
			DSCommand.createArrayOption(
				"include",
				DDataStructure.string(),
				{
					description: "Files to include",
					min: 1,
					max: 5,
				},
			),
		],
		subjects: [
			DSCommand.createArgument(
				"source",
				DDataStructure.string(),
			),
			DSCommand.createArgument(
				"destination",
				DDataStructure.string(),
			),
		],
	},
	({
		args: { source, destination },
		options: { mode, force, include },
	}) => {
		void source;
		void destination;
		void mode;
		void force;
		void include;
	},
);

// Si ce fichier est exposé comme binaire, `DSCommand.exec` lit les arguments
// transmis par le terminal. Le fichier peut être un `.ts` exécutable lorsque
// son shebang indique l'interpréteur à utiliser.
//
// #!/usr/bin/env -S tsx
//
// package.json
// {
//   "bin": {
//     "my-cli": "./scripts/bin.ts"
//   }
// }
//
// my-cli Jane
// -> name: "Jane"
//
// my-cli ./src ./dist --mode=copy --force --include=a.ts,b.ts
// -> source: "./src"
// -> destination: "./dist"
// -> mode: "copy"
// -> force: true
// -> include: ["a.ts", "b.ts"]
