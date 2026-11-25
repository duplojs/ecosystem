/**
 * @title DSPath.toPlatformPathOrThrow
 *
 * Convertir un chemin DuploJS pour la plateforme ou lever une erreur.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DSPath from "@duplojs/server/path";

const path = DSPath.toPlatformPathOrThrow(DPath.declarePath("src/file.txt"));
// Windows : "src\\file.txt" ; ailleurs : "src/file.txt". Un chemin non
// représentable lève InvalidPlatformPathError ; toPlatformPath retourne un Either.
type _CheckPath = DCommon.ExpectType<
	typeof path,
	string,
	"strict"
>;
