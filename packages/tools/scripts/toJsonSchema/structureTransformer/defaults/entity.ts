import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DEither from "@duplojs/lang/either";
import { createStructureTransformer } from "../create";
import type { JsonSchemaObject } from "./object";

export interface JsonSchemaEntity extends JsonSchemaObject {
	title: string;
}

export const entityStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(DModeling.entityStructureKind),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const innerResult = transformer(structure.definition.inner.value);

		if (DEither.isLeft(innerResult)) {
			return innerResult;
		}

		const innerType = DEither.unwrapRight(innerResult);

		return success(
			{
				title: structure.name,
				...innerType,
			},
		);
	},
);
