import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export interface JsonSchemaBoolean {
	type: "boolean";
}

export const booleanTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.booleanTypeKind),
	(
		_type,
		_constraints,
		{
			success,
		},
	) => success({ type: "boolean" }),
);
