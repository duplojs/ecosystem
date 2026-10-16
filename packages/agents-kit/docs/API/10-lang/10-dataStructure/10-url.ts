/**
 * @title DDataStructure.url
 *
 * Construire une contrainte d’URL valide.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const constraint = DDataStructure.url();
type _CheckConstraint = DCommon.ExpectType<
	typeof constraint,
	DDataStructure.UrlConstraint,
	"strict"
>;

const structure = DDataStructure.string([constraint]);
const result = structure.check("https://duplojs.dev");

// Une validation réussie expose une valeur portant le type du contrat.
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Url,
	"strict"
>;
