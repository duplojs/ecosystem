import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const arrayStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DDataStructure.arrayStructureKind),
	(structure, { find }) => void find(structure.definition.element),
);
