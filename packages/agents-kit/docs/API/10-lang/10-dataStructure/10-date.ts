/**
 * @title DDataStructure.date
 *
 * Construire une structure représentant les dates DuploJS.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DChrono from "@duplojs/lang/chrono";

const structure = DDataStructure.date();
const result = structure.check(new Date("2024-01-01T00:00:00.000Z"));

// La structure représente le type indiqué par son contrat.
type _CheckStructure = DCommon.ExpectType<
	typeof structure,
	DDataStructure.TypeStructure<DChrono.TheDate, readonly []>,
	"strict"
>;
type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	DChrono.TheDate,
	"strict"
>;
