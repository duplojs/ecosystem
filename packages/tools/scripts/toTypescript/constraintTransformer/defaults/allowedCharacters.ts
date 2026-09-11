import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const allowedCharactersConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.allowedCharactersConstraintKind,
	),
	(
		constraint,
		{
			success,
			buildError,
			addImport,
		},
	) => {
		const charactersRanges = typeof constraint.definition.charactersRange === "string"
			? [constraint.definition.charactersRange]
			: constraint.definition.charactersRange;
		const typeNodes = charactersRanges.map(
			(charactersRange) => Typescript.factory.createTypeReferenceNode(
				Typescript.factory.createQualifiedName(
					Typescript.factory.createIdentifier("DString"),
					Typescript.factory.createIdentifier("AllowedCharacters"),
				),
				[
					Typescript.factory.createLiteralTypeNode(
						Typescript.factory.createStringLiteral(charactersRange),
					),
				],
			),
		);

		if (typeNodes.length === 0) {
			return buildError();
		}

		addImport("@duplojs/lang/string", "DString", "namespace");

		return success(
			typeNodes.length === 1
				? typeNodes[0]!
				: Typescript.factory.createIntersectionTypeNode(typeNodes),
		);
	},
);
