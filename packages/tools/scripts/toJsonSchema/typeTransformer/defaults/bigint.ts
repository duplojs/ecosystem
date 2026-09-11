import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";

export interface JsonSchemaBigint {
	type: "integer";
}

export const bigintTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.bigintTypeKind),
	(
		_type,
		_constraints,
		{
			success,
		},
	) => success({ type: "integer" }),
);
