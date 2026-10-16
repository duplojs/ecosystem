/**
 * @title DDataStructure.undefined
 *
 * Construire une structure représentant la valeur `undefined`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.undefined();
const result = structure.check(undefined);

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<undefined, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	undefined,
	"strict"
>;
