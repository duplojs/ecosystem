/**
 * @title DDataStructure.required
 *
 * Rendre obligatoires les propriétés d’une structure objet qui peuvent être `undefined`.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const source = DDataStructure.object({
	name: DDataStructure.optional(DDataStructure.string()),
});
const structure = DDataStructure.required(source);
const result = structure.check({ name: "Jane" });

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	{
		readonly name: string;
	},
	"strict"
>;
