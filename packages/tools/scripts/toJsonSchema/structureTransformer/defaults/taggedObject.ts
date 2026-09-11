import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DEither from "@duplojs/lang/either";
import { createStructureTransformer } from "../create";
import type { JsonSchemaObject } from "./object";

export interface JsonSchemaTaggedObject extends JsonSchemaObject {
	title: string;
}

export const taggedObjectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(DModeling.taggedObjectStructureKind),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const innerResult = transformer(structure.definition.inner);

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
