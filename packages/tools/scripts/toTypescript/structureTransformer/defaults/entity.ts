import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DModeling from "@duplojs/lang/modeling";
import * as DCommon from "@duplojs/lang/common";
import * as DObject from "@duplojs/lang/object";
import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";
import { createIdentifier } from "@scripts/toTypescript/createIdentifier";

export const entityStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.entityStructureKind,
	),
	(
		structure,
		{
			context,
			transformer,
			success,
			addImport,
		},
	) => {
		const shape = DCommon.pipe(
			structure.definition.inner.value.definition.shape.value,
			DArray.select(
				({ element, select, skip }) => {
					if (element.key === DModeling.entityKind.runTimeKey) {
						return skip();
					}

					return select(
						DObject.entry(element.key, element.value),
					);
				},
			),
			DObject.fromEntries,

		);

		const objectResult = transformer(DDataStructure.object(shape));

		if (DEither.isLeft(objectResult)) {
			return objectResult;
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		const identifier = createIdentifier(structure.definition.identifier ?? structure.name);

		context.set(
			structure,
			Typescript.factory.createTypeAliasDeclaration(
				[Typescript.factory.createModifier(Typescript.SyntaxKind.ExportKeyword)],
				identifier,
				undefined,
				Typescript.factory.createIntersectionTypeNode([
					Typescript.factory.createTypeReferenceNode(
						Typescript.factory.createQualifiedName(
							Typescript.factory.createIdentifier("DModeling"),
							Typescript.factory.createIdentifier("Entity"),
						),
						[
							Typescript.factory.createLiteralTypeNode(
								Typescript.factory.createStringLiteral(structure.name),
							),
						],
					),
					DEither.unwrapRight(objectResult),
				]),
			),
		);

		return success(
			Typescript.factory.createTypeReferenceNode(identifier),
		);
	},
);
