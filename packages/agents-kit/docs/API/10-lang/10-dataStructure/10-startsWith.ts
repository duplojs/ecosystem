/**
 * @title DDataStructure.startsWith
 *
 * Construire une contrainte de préfixe et l’appliquer à une structure de chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.startsWith("user:");
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.StartsWithConstraint<"user:">,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("user:42");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	`user:${string}`,
	"strict"
>;
