/**
 * @title DDataStructure.uuid
 *
 * Construire une contrainte d’UUID valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.uuid();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.UuidConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("550e8400-e29b-41d4-a716-446655440000");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Uuid,
	"strict"
>;
