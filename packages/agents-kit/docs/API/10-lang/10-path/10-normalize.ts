/**
 * @title DPath.normalize
 *
 * Réduire les séparateurs et les segments relatifs d’un chemin.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.normalize("src//module/../index.ts");
// La valeur obtenue est src/index.ts ; null signale une entrée invalide.
type _CheckResult = DCommon.ExpectType<typeof result, (string & DPath.Path) | null, "strict">;
