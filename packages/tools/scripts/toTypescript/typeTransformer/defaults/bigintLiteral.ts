import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const bigintLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.bigintLiteralTypeKind),
	(
		type,
		{ success },
	) => {
		const value = type.definition.value;

		return success(
			Typescript.factory.createLiteralTypeNode(
				value < 0n
					? Typescript.factory.createPrefixUnaryExpression(
						Typescript.SyntaxKind.MinusToken,
						Typescript.factory.createBigIntLiteral(`${-value}n`),
					)
					: Typescript.factory.createBigIntLiteral(`${value}n`),
			),
		);
	},
);
