import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const undefinedTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.undefinedTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createKeywordTypeNode(
			Typescript.SyntaxKind.UndefinedKeyword,
		),
	),
);
