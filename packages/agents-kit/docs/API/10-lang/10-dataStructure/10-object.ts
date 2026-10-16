/**
 * @title DDataStructure.object
 *
 * Construire une structure objet à partir d’une forme de propriétés.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const structure = DDataStructure.object({
	name: DDataStructure.string(),
	age: DDataStructure.number(),
});
const result = structure.check({
	name: "Jane",
	age: 30,
});

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	{
		readonly name: string;
		readonly age: number;
	},
	"strict"
>;
