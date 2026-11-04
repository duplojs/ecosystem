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
