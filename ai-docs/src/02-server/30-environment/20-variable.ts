/**
 * @title Manipuler les variables d'environnement
 *
 * `environmentVariable` permet de charger, valider et transformer
 * des variables d'environnement à partir du système et de fichiers.
 *
 * La variante `OrThrow` est particulièrement adaptée au chargement
 * de configuration au démarrage d'une application.
 */
import * as DServerCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";

const envs = await DServerCommon.environmentVariableOrThrow(
	{
		host: DDataStructure.literal(["0.0.0.0", "127.0.0.1", "localhost"]),
		port: DDataStructure.number([DDataStructure.positive()]),
		name: DDataStructure.string(),
		ENVIRONMENT: DDataStructure.literal(["DEV", "PROD"]),
		DATABASE_URL: DDataStructure.string([DDataStructure.url()]),
	},
	{
		// Ajoute des fichiers comme sources de variables.
		includedEnvironmentFiles: [DCommon.infer(".env"), DCommon.infer(".env.local")],

		// Lit les fichiers sans enrichir les variables d'environnement du système.
		justRead: true,

		// Les sources suivantes peuvent remplacer les valeurs précédentes.
		override: false,
	},
);
// {
//     readonly host: "0.0.0.0" | "127.0.0.1" | "localhost";
//     readonly name: string;
//     readonly port: number & Positive;
//     readonly ENVIRONMENT: "DEV" | "PROD";
//     readonly DATABASE_URL: string & Url;
// }
