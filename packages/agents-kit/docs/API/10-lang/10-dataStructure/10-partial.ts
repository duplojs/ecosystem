/**
 * @title DDataStructure.partial
 *
 * Rendre optionnelles toutes les propriétés d’une structure objet.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const source = DDataStructure.object({
	name: DDataStructure.string(),
	age: DDataStructure.number(),
});
const structure = DDataStructure.partial(source);
const result = structure.check({ name: "Jane" });

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	{
		readonly name?: string;
		readonly age?: number;
	},
	"strict"
>;
