/**
 * @title DPath.declareSegment
 *
 * Déclarer un littéral valide comme segment après vérification statique.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";

const segment = DPath.declareSegment("index.ts");
// Le littéral conserve sa valeur et reçoit les contraintes Segment et Path.
type _CheckSegment = DCommon.ExpectType<typeof segment, "index.ts" & DPath.Segment & DPath.Path, "strict">;
