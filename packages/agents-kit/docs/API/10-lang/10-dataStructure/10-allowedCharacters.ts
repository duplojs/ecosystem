/**
 * @title DDataStructure.allowedCharacters
 *
 * Construire une contrainte de caractères autorisés et l’appliquer à une structure de chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.allowedCharacters("a-z");
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.AllowedCharactersConstraint<"a-z">,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("abc");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.AllowedCharacters<"a-z">,
	"strict"
>;
