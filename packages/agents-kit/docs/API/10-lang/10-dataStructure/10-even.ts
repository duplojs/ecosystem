/**
 * @title DDataStructure.even
 *
 * Construire une contrainte de nombre pair et l’appliquer à une structure numérique.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.even();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.EvenConstraint,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(8);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.Even,
	"strict"
>;
