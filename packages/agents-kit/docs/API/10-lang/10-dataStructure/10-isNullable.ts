/**
 * @title DDataStructure.isNullable
 *
 * Vérifier qu’une structure accepte la valeur `null`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.nullable(DDataStructure.string());
const result = DDataStructure.isNullable(structure);

type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;
