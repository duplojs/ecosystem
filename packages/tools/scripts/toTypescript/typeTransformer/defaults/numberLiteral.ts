import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const numberLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.numberLiteralTypeKind),
	(
		type,
		{
			success,
			buildError,
		},
	) => {
		const value = type.definition.value;

		if (!Number.isFinite(value)) {
			return buildError();
		}

		return success(
			Typescript.factory.createLiteralTypeNode(
				value < 0
					? Typescript.factory.createPrefixUnaryExpression(
						Typescript.SyntaxKind.MinusToken,
						Typescript.factory.createNumericLiteral(-value),
					)
					: Typescript.factory.createNumericLiteral(value),
			),
		);
	},
);
