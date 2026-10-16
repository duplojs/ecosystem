/**
 * @title DDataStructure.union
 *
 * Construire une structure qui accepte plusieurs structures alternatives.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.union([
	DDataStructure.string(),
	DDataStructure.number(),
]);
const result = structure.check("DuploJS");

type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.UnionStructure<string | number, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string | number,
	"strict"
>;
