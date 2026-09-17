import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const newTypeStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DModeling.newTypeStructureKind),
	(structure, { find }) => void find(structure.definition.inner),
);
