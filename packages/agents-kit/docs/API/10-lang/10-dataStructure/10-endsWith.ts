/**
 * @title DDataStructure.endsWith
 *
 * Construire une contrainte de suffixe et l’appliquer à une structure de chaîne.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const constraint = DDataStructure.endsWith(".json");
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.EndsWithConstraint<".json">,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("settings.json");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	`${string}.json`,
	"strict"
>;
