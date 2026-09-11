import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const arrayStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.arrayStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
		},
	) => {
		const elementResult = transformer(structure.definition.element);

		if (DEither.isLeft(elementResult)) {
			return elementResult;
		}

		return success(
			Typescript.factory.createTypeOperatorNode(
				Typescript.SyntaxKind.ReadonlyKeyword,
				Typescript.factory.createArrayTypeNode(
					DEither.unwrapRight(elementResult),
				),
			),
		);
	},
);
