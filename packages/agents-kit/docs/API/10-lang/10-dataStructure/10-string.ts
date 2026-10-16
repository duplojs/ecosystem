/**
 * @title DDataStructure.string
 *
 * Construire une structure représentant des chaînes de caractères.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.string();
const result = structure.check("DuploJS");

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<string, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string,
	"strict"
>;
