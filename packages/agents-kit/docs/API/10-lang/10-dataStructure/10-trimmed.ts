/**
 * @title DDataStructure.trimmed
 *
 * Construire une contrainte de chaîne sans espaces périphériques.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.trimmed();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.TrimmedConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("DuploJS");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Trimmed,
	"strict"
>;
