/**
 * @title DDataStructure.minCharacters
 *
 * Construire une contrainte de longueur minimale pour une chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.minCharacters(3);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.MinCharactersConstraint<3>,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("abc");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.MinCharacters<3>,
	"strict"
>;
