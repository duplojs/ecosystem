import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createConstraintTransformer } from "../create";

export const startsWithConstraintTransformer = createConstraintTransformer(
	DDataStructure.constraintIdentifier(
		DDataStructure.startsWithConstraintKind,
	),
	(
		constraint,
		{
			success,
		},
	) => success(
		Typescript.factory.createTemplateLiteralType(
			Typescript.factory.createTemplateHead(constraint.definition.searchString),
			[
				Typescript.factory.createTemplateLiteralTypeSpan(
					Typescript.factory.createKeywordTypeNode(Typescript.SyntaxKind.StringKeyword),
					Typescript.factory.createTemplateTail(""),
				),
			],
		),
	),
);
