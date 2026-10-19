/**
 * @title DDataStructure.include
 *
 * Construire une contrainte d’inclusion et l’appliquer à une structure de chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.include("lang");
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.IncludeConstraint<"lang">,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("duplo-lang");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	`${string}lang${string}`,
	"strict"
>;
