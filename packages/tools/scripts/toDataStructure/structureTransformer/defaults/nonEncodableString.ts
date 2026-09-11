import * as DDataStructure from "@duplojs/lang/dataStructure";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const nonEncodableStringStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.nonEncodableStringStructureKind,
	),
	(
		structure,
		{
			success,
		},
	) => success(
		Typescript.factory.createCallExpression(
			Typescript.factory.createPropertyAccessExpression(
				Typescript.factory.createIdentifier("DDataStructure"),
				Typescript.factory.createIdentifier("NonEncodableStringStructure"),
			),
			undefined,
			[Typescript.factory.createStringLiteral(structure.definition.value)],
		),
	),
);
