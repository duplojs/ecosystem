/**
 * @title DDataStructure.segmentPath
 *
 * Construire une contrainte qui exige un segment de chemin.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DPath from "@duplojs/lang/path";

const constraint = DDataStructure.segmentPath();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.SegmentPathConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("index.ts");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DPath.Segment,
	"strict"
>;
