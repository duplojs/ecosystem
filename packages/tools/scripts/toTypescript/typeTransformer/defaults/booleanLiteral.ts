import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createTypeTransformer } from "../create";

export const booleanLiteralTypeTransformer = createTypeTransformer(
	DDataStructure.typeIdentifier(DDataStructure.booleanLiteralTypeKind),
	(
		type,
		{ success },
	) => success(
		Typescript.factory.createLiteralTypeNode(
			type.definition.value
				? Typescript.factory.createTrue()
				: Typescript.factory.createFalse(),
		),
	),
);
