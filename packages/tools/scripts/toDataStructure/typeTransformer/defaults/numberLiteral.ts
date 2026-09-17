import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const numberLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.numberLiteralTypeKind),
	(
		type,
		{ success },
	) => {
		const value = type.definition.value;

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("NumberLiteralType"),
				),
				undefined,
				[
					value < 0
						? Typescript.factory.createPrefixUnaryExpression(
							Typescript.SyntaxKind.MinusToken,
							Typescript.factory.createNumericLiteral(-value),
						)
						: Typescript.factory.createNumericLiteral(value),
				],
			),
		);
	},
);
