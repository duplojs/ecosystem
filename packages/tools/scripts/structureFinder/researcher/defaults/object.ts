import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import { createResearcher } from "../create";

export const objectStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DDataStructure.objectStructureKind),
	(structure, { find }) => void DArray.map(
		structure.definition.optimizedShape.value,
		({ value }) => void find(value),
	),
);
