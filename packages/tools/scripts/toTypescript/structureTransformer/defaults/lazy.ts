import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createStructureTransformer } from "../create";

export const lazyStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.lazyStructureKind,
	),
	(
		structure,
		{ transformer },
	) => transformer(structure.definition.getter.value),
);
