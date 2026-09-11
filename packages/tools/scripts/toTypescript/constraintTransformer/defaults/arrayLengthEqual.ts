import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const arrayLengthEqualConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.arrayLengthEqualConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const length = constraint.definition.length;

		if (!Number.isFinite(length)) {
			return buildError();
		}

		addImport("@duplojs/lang/array", "DArray", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DArray"),
					Typescript.factory.createIdentifier("LengthEqual"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						length < 0
							? Typescript.factory.createPrefixUnaryExpression(
								Typescript.SyntaxKind.MinusToken,
								Typescript.factory.createNumericLiteral(-length),
							)
							: Typescript.factory.createNumericLiteral(length),
					),
				],
			),
		);
	},
);
