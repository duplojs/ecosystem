/**
 * @title DDataStructure.regex
 *
 * Construire une contrainte de correspondance avec une expression régulière.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.regex(/^user:[0-9]+$/);
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.RegexConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("user:42");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string,
	"strict"
>;
