/**
 * @title DDataStructure.notZero
 *
 * Construire une contrainte qui refuse zéro.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.notZero();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.NotZeroConstraint,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(1);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.NotZero,
	"strict"
>;
