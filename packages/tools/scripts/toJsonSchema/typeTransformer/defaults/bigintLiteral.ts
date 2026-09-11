import * as DDataStructure from "@duplojs/lang/dataStructure";
import { createTypeTransformer } from "../create";
import type { JsonSchemaBigint } from "./bigint";

export interface JsonSchemaBigintLiteral extends JsonSchemaBigint {
	const: bigint;
}

export const bigintLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.bigintLiteralTypeKind),
	(
		type,
		_constraints,
		{
			success,
		},
	) => success({
		type: "integer",
		const: type.definition.value,
	}),
);
