/**
 * @title DSCommon.environmentVariableOrThrow
 *
 * Charger une configuration typée ou lever une erreur.
 */
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSCommon from "@duplojs/server/common";

// Adapté au démarrage lorsque la configuration est indispensable.
const configuration = await DSCommon.environmentVariableOrThrow(
	{
		PORT: DDataStructure.number(),
		HOST: DDataStructure.string(),
	},
	{ justRead: true },
);

// Une lecture ou un décodage en échec lève EnvironmentVariableError.

// Voir 10-environmentVariable.ts pour les sources, la priorité, les codecs
// et les effets de justRead ; cette variante applique les mêmes paramètres.
