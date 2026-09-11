import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { JsonSchema } from "../../result";
import { createStructureTransformer } from "../create";

export interface JsonSchemaObject {
	type: "object";
	properties: Record<string, JsonSchema>;
	required: string[];
	additionalProperties: false;
}

export const objectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.objectStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const properties: Record<string, JsonSchema> = {};
		const required: string[] = [];

		for (const entry of structure.definition.shape.value) {
			const valueResult = transformer(entry.value);

			if (DEither.isLeft(valueResult)) {
				return valueResult;
			}

			properties[entry.key] = DEither.unwrapRight(valueResult);
			required.push(entry.key);
		}

		return success({
			type: "object",
			properties,
			required,
			additionalProperties: false,
		});
	},
);
