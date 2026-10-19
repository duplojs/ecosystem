import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const endsWithConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.endsWithConstraintKind,
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
					Typescript.factory.createTemplateTail(constraint.definition.searchString),
				),
			],
		),
	),
);
