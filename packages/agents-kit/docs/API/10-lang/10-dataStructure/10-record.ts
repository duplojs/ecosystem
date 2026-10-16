/**
 * @title DDataStructure.record
 *
 * Construire une structure d’objet dont les clés et les valeurs sont structurées.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.record(
	DDataStructure.string(),
	DDataStructure.number(),
);
const result = structure.check({
	first: 1,
	second: 2,
});

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	Partial<{ readonly [Prop in string]: number }>,
	"strict"
>;
