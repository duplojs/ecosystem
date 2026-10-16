/**
 * @title DDataStructure.bigint
 *
 * Construire une structure représentant des valeurs `bigint`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.bigint();
const result = structure.check(42n);

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<bigint, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	bigint,
	"strict"
>;
