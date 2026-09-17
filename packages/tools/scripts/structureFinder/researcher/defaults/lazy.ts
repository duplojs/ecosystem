import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const lazyStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DDataStructure.lazyStructureKind),
	(structure, { find }) => void find(structure.definition.getter.value),
);
