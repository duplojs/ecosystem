import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createResearcher } from "../create";

export const entityStructureResearcher = createResearcher(
	DDataStructure.structureIdentifier(DModeling.entityStructureKind),
	(structure, { find }) => void find(structure.definition.inner.value),
);
