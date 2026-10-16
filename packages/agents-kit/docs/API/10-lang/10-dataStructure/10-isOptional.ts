/**
 * @title DDataStructure.isOptional
 *
 * Vérifier qu’une structure accepte la valeur `undefined`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.optional(DDataStructure.string());
const result = DDataStructure.isOptional(structure);

type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
