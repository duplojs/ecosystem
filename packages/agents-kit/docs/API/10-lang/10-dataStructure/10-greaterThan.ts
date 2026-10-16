/**
 * @title DDataStructure.greaterThan
 *
 * Construire une contrainte de nombre supérieur à un seuil.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.greaterThan(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.GreaterThanConstraint<3>,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(4);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.GreaterThan<3>,
	"strict"
>;
