/**
 * @title DDataStructure.lazy
 *
 * Construire une structure dont la résolution est différée.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.lazy(
	() => DDataStructure.string(),
);
const result = structure.check("DuploJS");

type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.LazyStructure<string, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string,
	"strict"
>;
