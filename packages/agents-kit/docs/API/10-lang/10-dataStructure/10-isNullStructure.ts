/**
 * @title DDataStructure.isNullStructure
 *
 * Vérifier qu’une structure représente exactement le type `null`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.null();
const result = DDataStructure.isNullStructure(structure);

type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
