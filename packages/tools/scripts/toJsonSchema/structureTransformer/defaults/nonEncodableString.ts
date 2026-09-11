import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createStructureTransformer } from "../create";

export interface JsonSchemaNonEncodableString {
	type: "string";
	const: string;
}

export const nonEncodableStringStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.nonEncodableStringStructureKind,
	),
	(
		structure,
		{ success },
	) => success({
		type: "string",
		const: structure.definition.value,
	}),
);
