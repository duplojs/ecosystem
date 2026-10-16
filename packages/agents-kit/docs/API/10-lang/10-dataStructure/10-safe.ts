/**
 * @title DDataStructure.safe
 *
 * Construire une contrainte d’entier sûr JavaScript.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DNumber from "@duplojs/lang/number";

const constraint = DDataStructure.safe();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.SafeConstraint,
	"strict"
>;

const structure = DDataStructure.number([constraint]);
const result = structure.check(42);

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	number & DNumber.Safe,
	"strict"
>;
