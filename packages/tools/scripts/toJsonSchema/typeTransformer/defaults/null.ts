import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export interface JsonSchemaNull {
	type: "null";
}

export const nullTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.nullTypeKind),
	(
		_type,
		_constraints,
		{
			success,
		},
	) => success({ type: "null" }),
);
