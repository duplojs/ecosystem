import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const lessThanOrEqualConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.lessThanOrEqualConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const threshold = constraint.definition.threshold;

		if (!Number.isFinite(threshold)) {
			return buildError();
		}

		addImport("@duplojs/lang/number", "DNumber", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DNumber"),
					Typescript.factory.createIdentifier("LessThanOrEqual"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						threshold < 0
							? Typescript.factory.createPrefixUnaryExpression(
								Typescript.SyntaxKind.MinusToken,
								Typescript.factory.createNumericLiteral(-threshold),
							)
							: Typescript.factory.createNumericLiteral(threshold),
					),
				],
			),
		);
	},
);
