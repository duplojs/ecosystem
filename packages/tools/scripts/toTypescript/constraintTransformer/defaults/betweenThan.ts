import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const betweenThanConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.betweenThanConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const { greater, less } = constraint.definition;

		if (
			!Number.isFinite(greater)
			|| !Number.isFinite(less)
		) {
			return buildError();
		}

		addImport("@duplojs/lang/number", "DNumber", "namespace");

		return success(
			Typescript.factory.createIntersectionTypeNode([
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createQualifiedName(
						Typescript.factory.createIdentifier("DNumber"),
						Typescript.factory.createIdentifier("GreaterThan"),
					),
					[
						Typescript.factory.createLiteralTypeNode(
							greater < 0
								? Typescript.factory.createPrefixUnaryExpression(
									Typescript.SyntaxKind.MinusToken,
									Typescript.factory.createNumericLiteral(-greater),
								)
								: Typescript.factory.createNumericLiteral(greater),
						),
					],
				),
				Typescript.factory.createTypeReferenceNode(
					Typescript.factory.createQualifiedName(
						Typescript.factory.createIdentifier("DNumber"),
						Typescript.factory.createIdentifier("LessThan"),
					),
					[
						Typescript.factory.createLiteralTypeNode(
							less < 0
								? Typescript.factory.createPrefixUnaryExpression(
									Typescript.SyntaxKind.MinusToken,
									Typescript.factory.createNumericLiteral(-less),
								)
								: Typescript.factory.createNumericLiteral(less),
						),
					],
				),
			]),
		);
	},
);
