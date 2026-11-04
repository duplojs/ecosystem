/**
 * @title DPath.createOrThrow
 *
 * Normaliser un chemin ou lever une erreur si l’entrée est invalide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createOrThrow("src//module/../index.ts");
// La valeur obtenue est src/index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Path, "strict">;
