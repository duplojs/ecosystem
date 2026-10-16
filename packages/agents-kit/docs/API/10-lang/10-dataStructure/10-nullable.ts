/**
 * @title DDataStructure.nullable
 *
 * Ajouter `null` aux valeurs acceptées par une structure.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import type * as DString from "@duplojs/lang/string";

const structure = DDataStructure.nullable(
	DDataStructure.string([DDataStructure.email()]),
);
const result = structure.check(null);

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	string & DString.Email | null,
	"strict"
>;
