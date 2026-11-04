/**
 * @title DPath.createSegmentOrThrow
 *
 * Normaliser un segment ou lever une erreur si l’entrée n’est pas un segment valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const result = DPath.createSegmentOrThrow("index.ts");
// La valeur obtenue est index.ts.
type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment & DPath.Path, "strict">;
