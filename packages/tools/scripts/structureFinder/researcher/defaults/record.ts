import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const recordStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DDataStructure.recordStructureKind),
	(structure, { find }) => {
		find(structure.definition.key);
		find(structure.definition.value);
	},
);
