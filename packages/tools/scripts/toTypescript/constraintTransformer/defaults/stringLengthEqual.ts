import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const stringLengthEqualConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.stringLengthEqualConstraintKind,
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

		addImport("@duplojs/lang/string", "DString", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DString"),
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
