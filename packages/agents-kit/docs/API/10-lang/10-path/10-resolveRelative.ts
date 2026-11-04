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

// Un chemin absolu remplace tout ce qui a été assemblé avant lui.
const absolute = DPath.resolveRelative([
	DPath.declarePath("ignored"),
	DPath.declareAbsolutePath("/workspace"),
	DPath.declarePath("src/index.ts"),
]);
// La valeur obtenue est /workspace/src/index.ts ; l’entrée absolue établit Absolute.
type _CheckAbsolute = DCommon.ExpectType<typeof absolute, string & DPath.Path & DPath.Absolute, "strict">;
