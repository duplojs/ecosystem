/**
 * @title DDataStructure.minElements
 *
 * Construire une contrainte de cardinalité minimale pour un tableau.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.minElements(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.MinElementsConstraint<3>,
	"strict"
>;

const structure = DDataStructure.array(DDataStructure.number(), [constraint]);
const result = structure.check([1, 2, 3]);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	readonly number[] & DArray.MinElements<3>,
	"strict"
>;
