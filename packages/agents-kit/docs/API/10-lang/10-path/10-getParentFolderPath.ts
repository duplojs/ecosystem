/**
 * @title DPath.getParentFolderPath
 *
 * Lire le dossier parent d’un chemin en conservant son caractère absolu lorsqu’il est connu.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const path = DPath.declareAbsolutePath("/workspace/src/index.ts");
const result = DPath.getParentFolderPath(path);
// La valeur obtenue est /workspace/src.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Path & DPath.Absolute) | null, "strict">;

// Avec un chemin relatif, le résultat ne porte pas Absolute.
const relativeParent = DPath.getParentFolderPath(DPath.declarePath("src/index.ts"));
// La valeur obtenue est src.
type _CheckRelativeParent = DCommon.ExpectType<typeof relativeParent, (string & DPath.Path) | null, "strict">;

// La racine n’a pas de parent ; un nom isolé a pour parent le chemin courant.
const rootParent = DPath.getParentFolderPath(DPath.declareAbsolutePath("/"));
// La valeur obtenue est null.
type _CheckRootParent = DCommon.ExpectType<typeof rootParent, (string & DPath.Path & DPath.Absolute) | null, "strict">;
const localParent = DPath.getParentFolderPath(DPath.declareSegment("index.ts"));
// La valeur obtenue est ".".
type _CheckLocalParent = DCommon.ExpectType<typeof localParent, (string & DPath.Path) | null, "strict">;
