/**
 * @title DDataStructure.notEmpty
 *
 * Construire une contrainte qui refuse les chaînes vides.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.notEmpty();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.NotEmptyConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("DuploJS");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.NotEmpty,
	"strict"
>;
