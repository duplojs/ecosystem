import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const multipleOfConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.multipleOfConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const multiple = constraint.definition.multiple;

		if (!Number.isFinite(multiple)) {
			return buildError();
		}

		addImport("@duplojs/lang/number", "DNumber", "namespace");

		return success(
			Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DNumber"),
					Typescript.factory.createIdentifier("MultipleOf"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						multiple < 0
							? Typescript.factory.createPrefixUnaryExpression(
								Typescript.SyntaxKind.MinusToken,
								Typescript.factory.createNumericLiteral(-multiple),
							)
							: Typescript.factory.createNumericLiteral(multiple),
					),
				],
			),
		);
	},
);
