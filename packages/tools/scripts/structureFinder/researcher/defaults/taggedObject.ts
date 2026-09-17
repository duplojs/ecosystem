import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const taggedObjectStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DModeling.taggedObjectStructureKind),
	(structure, { find }) => void find(structure.definition.inner),
);
