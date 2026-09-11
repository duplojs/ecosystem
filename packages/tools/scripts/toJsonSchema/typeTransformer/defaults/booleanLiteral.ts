import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";
import type { JsonSchemaBoolean } from "./boolean";

export interface JsonSchemaBooleanLiteral extends JsonSchemaBoolean {
	const: boolean;
}

export const booleanLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.booleanLiteralTypeKind),
	(
		type,
		_constraints,
		{
			success,
		},
	) => success({
		type: "boolean",
		const: type.definition.value,
	}),
);
