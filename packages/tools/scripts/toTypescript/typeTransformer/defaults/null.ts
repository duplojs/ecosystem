import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const nullTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.nullTypeKind),
	(
		_type,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			Typescript.factory.createNull(),
		),
	),
);
