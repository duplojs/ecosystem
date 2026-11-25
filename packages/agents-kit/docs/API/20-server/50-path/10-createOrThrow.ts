/**
 * @title DSPath.createOrThrow
 *
 * Normaliser un chemin de plateforme ou lever une erreur.
 */
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const path = DSPath.createOrThrow("src/../index.ts");
// Le résultat vaut "index.ts" ; une entrée invalide lève CreatePathError,
// dont value contient l'entrée. En traitement réutilisable, préférer create.
type _CheckPath = DCommon.ExpectType<
	typeof path,
	string & DPath.Path,
	"strict"
>;
