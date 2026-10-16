/**
 * @title DDataStructure.isUndefinedStructure
 *
 * Vérifier qu’une structure représente exactement le type `undefined`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.undefined();
const result = DDataStructure.isUndefinedStructure(structure);

type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
