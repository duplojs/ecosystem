/**
 * @title DPath.createAbsoluteOrThrow
 *
 * Normaliser un chemin absolu ou lever une erreur si l’entrée est invalide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createAbsoluteOrThrow("/workspace/src/../index.ts");
// La valeur obtenue est /workspace/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Absolute & DPath.Path, "strict">;
