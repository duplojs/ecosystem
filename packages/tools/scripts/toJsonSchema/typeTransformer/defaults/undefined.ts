import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export interface JsonSchemaUndefined {
	not: Record<string, never>;
}

export const undefinedTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.undefinedTypeKind),
	(
		_type,
		_constraints,
		{
			success,
		},
	) => success({ not: {} }),
);
