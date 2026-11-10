/**
 * @title DSCommon.environmentVariable
 *
 * Charger et décoder une configuration issue de l’environnement.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DSCommon from "@duplojs/server/common";
import * as DSDataStructure from "@duplojs/server/dataStructure";

const result = await DSCommon.environmentVariable(
	{
		PORT: DDataStructure.number(),
		HOST: DDataStructure.string(),
		INPUT: DSDataStructure.file(),
	},
	{
		// Les fichiers sont lus dans cet ordre. Une erreur de lecture est renvoyée.
		includedEnvironmentFiles: [
			DPath.declarePath(".env"),
			DPath.declarePath(".env.local"),
		],
		// false : la première source gagne, en commençant par le runtime.
		// true : les sources suivantes remplacent les précédentes.
		override: false,
		// true : ne pas répercuter les valeurs chargées sur l'environnement.
		// Par défaut, l'environnement est mis à jour après validation réussie.
		justRead: true,
		// Les codecs serveur décodent aussi INPUT en interface de fichier.
		codecs: DSDataStructure.codecsString,
	},
);

if (DEither.isRight(result)) {
	const configuration = DEither.unwrapRight(result);

	type _CheckPort = DCommon.ExpectType<
		typeof configuration.PORT,
		number,
		"strict"
	>;

	// INPUT est une interface ; le codec seul ne vérifie pas l'existence.
	const inputPath = configuration.INPUT.path;
} else if (DEither.hasInformation(result, "decode-error")) {
	// Une variable absente ou invalide échoue au décodage de la shape.
	const validationError = DEither.unwrapLeft(result);
} else {
	// Un fichier d'environnement demandé n'a pas pu être lu : l'erreur
	// conserve les catégories de readTextFile (absence, permission, etc.).
	const readError = DEither.unwrapLeft(result);
}

// Les références comme ${HOST} sont développées après fusion des sources,
// avant le décodage. La valeur finale dépend de l'environnement courant.
