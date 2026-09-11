import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const nonEncodableStringStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.nonEncodableStringStructureKind,
	),
	(
		_structure,
		{ success },
	) => success(
		Typescript.factory.createTypeReferenceNode("String"),
	),
);
