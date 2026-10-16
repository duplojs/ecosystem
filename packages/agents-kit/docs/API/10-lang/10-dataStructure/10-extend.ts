/**
 * @title DDataStructure.extend
 *
 * Étendre une structure objet en ajoutant ou en remplaçant des propriétés.
 */
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

const source = DDataStructure.object({
	name: DDataStructure.string(),
});
const structure = DDataStructure.extend(source, {
	id: DDataStructure.number(),
});
const result = structure.check({
	name: "Jane",
	id: 1,
});

type _CheckStructureValue = DCommon.ExpectType<
	DDataStructure.StructureValue<typeof structure>,
	{
		readonly name: string;
		readonly id: number;
	},
	"strict"
>;
