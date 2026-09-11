import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

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
		const typeNodes: Typescript.TypeNode[] = [];

		for (const value of structure.definition.values.value) {
			const valueResult = transformer(value);

			if (DEither.isLeft(valueResult)) {
				return valueResult;
			}

			typeNodes.push(DEither.unwrapRight(valueResult));
		}

		return success(
			Typescript.factory.createUnionTypeNode(typeNodes),
		);
	},
);
