/**
 * @title DDataStructure.odd
 *
 * Construire une contrainte de nombre impair.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.odd();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.OddConstraint,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(7);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.Odd,
	"strict"
>;
