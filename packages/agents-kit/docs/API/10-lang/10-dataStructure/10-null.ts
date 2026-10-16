/**
 * @title DDataStructure.null
 *
 * Construire une structure représentant la valeur `null`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.null();
const result = structure.check(null);

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<null, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	null,
	"strict"
>;
