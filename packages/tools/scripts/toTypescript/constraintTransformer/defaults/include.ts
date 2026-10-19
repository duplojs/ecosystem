import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const includeConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.includeConstraintKind,
	),
	(
		constraint,
		{
			success,
		},
	) => success(
		Typescript.factory.createTemplateLiteralType(
			Typescript.factory.createTemplateHead(""),
			[
				Typescript.factory.createTemplateLiteralTypeSpan(
					Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
					Typescript.factory.createTemplateMiddle(constraint.definition.searchString),
				),
				Typescript.factory.createTemplateLiteralTypeSpan(
					Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
					Typescript.factory.createTemplateTail(""),
				),
			],
		),
	),
);
