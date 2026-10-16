/**
 * @title DDataStructure.betweenThan
 *
 * Construire une contrainte de nombre strictement compris entre deux bornes.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.betweenThan(1, 3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.BetweenThanConstraint<1, 3>,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(2);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.GreaterThan<1> & DNumber.LessThan<3>,
	"strict"
>;
