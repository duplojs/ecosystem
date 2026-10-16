/**
 * @title DDataStructure.numberInString
 *
 * Construire une contrainte qui exige qu’une chaîne représente un nombre.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.numberInString();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.NumberInStringConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("42");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Number,
	"strict"
>;
