import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const minElementsConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.minElementsConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const min = constraint.definition.min;

		if (!Number.isFinite(min)) {
			return buildError();
		}

		addImport("@duplojs/lang/array", "DArray", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DArray"),
					Typescript.factory.createIdentifier("MinElements"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						min < 0
							? Typescript.factory.createPrefixUnaryExpression(
								Typescript.SyntaxKind.MinusToken,
								Typescript.factory.createNumericLiteral(-min),
							)
							: Typescript.factory.createNumericLiteral(min),
					),
				],
			),
		);
	},
);
