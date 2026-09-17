import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DArray from "@duplojs/lang/array";
import { createResearcher } from "../create";

export const unionStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DDataStructure.unionStructureKind),
	(structure, { find }) => void DArray.map(
		structure.definition.values.value,
		(value) => void find(value),
	),
);
