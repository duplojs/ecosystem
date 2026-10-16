/**
 * @title DDataStructure.multipleOf
 *
 * Construire une contrainte de multiple numérique.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.multipleOf(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.MultipleOfConstraint<3>,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(6);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.MultipleOf<3>,
	"strict"
>;
