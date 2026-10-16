/**
 * @title DDataStructure.literal
 *
 * Construire une structure représentant une ou plusieurs valeurs littérales.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.literal([
	"draft",
	"published",
]);
const result = structure.check("published");

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	"draft" | "published",
	"strict"
>;
