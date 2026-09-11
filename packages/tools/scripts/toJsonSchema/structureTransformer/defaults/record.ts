import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { JsonSchema } from "../../result";
import { createStructureTransformer } from "../create";

export interface JsonSchemaRecord {
	type: "object";
	propertyNames: JsonSchema;
	additionalProperties: JsonSchema;
	required?: string[];
	minProperties?: number;
}

export const recordStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.recordStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const keyResult = transformer(structure.definition.key);

		if (DEither.isLeft(keyResult)) {
			return keyResult;
		}

		const valueResult = transformer(structure.definition.value);

		if (DEither.isLeft(valueResult)) {
			return valueResult;
		}

		const requiredKeys = structure.definition.requiredKeys.value;

		return success({
			type: "object",
			propertyNames: DEither.unwrapRight(keyResult),
			additionalProperties: DEither.unwrapRight(valueResult),
			...requiredKeys?.length
				? {
					required: requiredKeys,
					minProperties: requiredKeys.length,
				}
				: {},
		});
	},
);
