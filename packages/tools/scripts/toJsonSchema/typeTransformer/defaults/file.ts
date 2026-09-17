import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import { createTypeTransformer } from "../create";

export interface JsonSchemaFile {
	type: "string";
	format: "binary";
}

export const fileTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DSDataStructure.fileTypeKind),
	(
		_type,
		_constraints,
		{ success },
	) => success({
		type: "string",
		format: "binary",
	}),
);
