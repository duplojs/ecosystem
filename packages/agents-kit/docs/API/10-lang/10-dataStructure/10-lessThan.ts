/**
 * @title DDataStructure.lessThan
 *
 * Construire une contrainte de nombre inférieur à un seuil.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.lessThan(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.LessThanConstraint<3>,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(2);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.LessThan<3>,
	"strict"
>;
