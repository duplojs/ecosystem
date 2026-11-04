/**
 * @title DPath.resolveRelative
 *
 * Résoudre une suite de chemins relatifs ou absolus en un seul chemin normalisé.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.resolveRelative([
	DPath.declarePath("src"),
	DPath.declarePath("index.ts"),
]);
// La valeur obtenue est src/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Path, "strict">;
