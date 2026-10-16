/**
 * @title DDataStructure.maxElements
 *
 * Construire une contrainte de cardinalité maximale pour un tableau.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.maxElements(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.MaxElementsConstraint<3>,
	"strict"
>;

const structure = DDataStructure.array(DDataStructure.number(), [constraint]);
const result = structure.check([1, 2]);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	readonly number[] & DArray.MaxElements<3>,
	"strict"
>;
