import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import type { JsonSchema } from "../../result";
import { createStructureTransformer } from "../create";

export interface JsonSchemaUnion {
	anyOf: JsonSchema[];
}

export const unionStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.unionStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const anyOf: JsonSchema[] = [];

		for (const value of structure.definition.values.value) {
			const valueResult = transformer(value);

			if (DEither.isLeft(valueResult)) {
				return valueResult;
			}

			anyOf.push(DEither.unwrapRight(valueResult));
		}

		return success({ anyOf });
	},
);
