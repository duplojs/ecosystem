/**
 * @title DDataStructure.path
 *
 * Construire une contrainte qui exige une chaîne représentant un chemin.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DPath from "@duplojs/lang/path";

const constraint = DDataStructure.path();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.PathConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("src/index.ts");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DPath.Path,
	"strict"
>;
