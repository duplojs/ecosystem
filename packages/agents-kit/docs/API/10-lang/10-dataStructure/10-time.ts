/**
 * @title DDataStructure.time
 *
 * Construire une structure représentant les heures DuploJS.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DChrono from "@duplojs/lang/chrono";

const structure = DDataStructure.time();
const result = structure.check("12:30:00.000");

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<DChrono.TheTime, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	DChrono.TheTime,
	"strict"
>;
