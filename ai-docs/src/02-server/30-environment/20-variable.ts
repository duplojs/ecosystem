/**
 * @title Manipuler les variables d'environnement
 *
 * Chargement de sources d'environnement, validation par `DataStructure` et
 * obtention d'une configuration typée.
 */
import * as DServerCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";

// `environmentVariableOrThrow` est adaptée au démarrage d'une application :
// une configuration invalide interrompt directement l'initialisation.
const envs = await DServerCommon.environmentVariableOrThrow(
	{
		host: DDataStructure.literal(["0.0.0.0", "127.0.0.1", "localhost"]),
		port: DDataStructure.number([DDataStructure.positive()]),
		name: DDataStructure.string(),
		ENVIRONMENT: DDataStructure.literal(["DEV", "PROD"]),
		DATABASE_URL: DDataStructure.string([DDataStructure.url()]),
	},
	{
		// Fichiers `.env` à lire en plus des variables déjà présentes
		// dans l'environnement du runtime.
		includedEnvironmentFiles: [DCommon.infer(".env"), DCommon.infer(".env.local")],

		// `false` garde la priorité aux valeurs déjà présentes.
		// `true` autorise les fichiers à remplacer ces valeurs.
		override: false,

		// `true` renvoie la configuration validée sans réécrire
		// `process.env` ou `Deno.env`.
		justRead: true,
	},
);
// {
//     readonly host: "0.0.0.0" | "127.0.0.1" | "localhost";
//     readonly name: string;
//     readonly port: number & Positive;
//     readonly ENVIRONMENT: "DEV" | "PROD";
//     readonly DATABASE_URL: string & Url;
// }
