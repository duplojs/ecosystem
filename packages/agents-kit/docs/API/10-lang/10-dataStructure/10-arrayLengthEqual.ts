/**
 * @title DDataStructure.arrayLengthEqual
 *
 * Construire une contrainte de longueur exacte et l’appliquer à une structure de tableau.
 */
import type * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.arrayLengthEqual(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.ArrayLengthEqualConstraint<3>,
	"strict"
>;

const structure = DDataStructure.array(DDataStructure.number(), [constraint]);
const result = structure.check([1, 2, 3]);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	readonly number[] & DArray.LengthEqual<3>,
	"strict"
>;
