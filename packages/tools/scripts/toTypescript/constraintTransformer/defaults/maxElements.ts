import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const maxElementsConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.maxElementsConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const max = constraint.definition.max;

		if (!Number.isFinite(max)) {
			return buildError();
		}

		addImport("@duplojs/lang/array", "DArray", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DArray"),
					Typescript.factory.createIdentifier("MaxElements"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						max < 0
							? Typescript.factory.createPrefixUnaryExpression(
								Typescript.SyntaxKind.MinusToken,
								Typescript.factory.createNumericLiteral(-max),
							)
							: Typescript.factory.createNumericLiteral(max),
					),
				],
			),
		);
	},
);
