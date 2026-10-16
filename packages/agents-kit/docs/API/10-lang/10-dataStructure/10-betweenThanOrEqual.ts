/**
 * @title DDataStructure.betweenThanOrEqual
 *
 * Construire une contrainte de nombre compris entre deux bornes inclusives.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.betweenThanOrEqual(1, 3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.BetweenThanOrEqualConstraint<1, 3>,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(1);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.GreaterThanOrEqual<1> & DNumber.LessThanOrEqual<3>,
	"strict"
>;
