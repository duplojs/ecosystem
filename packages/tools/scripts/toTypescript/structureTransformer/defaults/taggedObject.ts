import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DObject from "@duplojs/lang/object";
import * as DArray from "@duplojs/lang/array";
import * as DModeling from "@duplojs/lang/modeling";
import { Typescript } from "@scripts/typescript";
import { createIdentifier } from "../../createIdentifier";
import { createStructureTransformer } from "../create";

export const taggedObjectStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.taggedObjectStructureKind,
	),
	(
		structure,
		{
			context,
			transformer,
			success,
			buildError,
			addImport,
		},
	) => {
		const shape = DCommon.pipe(
			structure.definition.inner.definition.shape.value,
			DArray.select(
				({ element, select, skip }) => {
					if (element.key === DModeling.objectTagKind.runTimeKey) {
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

		const objectTypeNode = DEither.unwrapRight(objectResult);

		if (!Typescript.isTypeLiteralNode(objectTypeNode)) {
			return buildError();
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		const identifier = createIdentifier(structure.definition.identifier ?? structure.name);

		context.set(
			structure,
			Typescript.factory.createInterfaceDeclaration(
				[Typescript.factory.createModifier(Typescript.SyntaxKind.ExportKeyword)],
				identifier,
				undefined,
				[
					Typescript.factory.createHeritageClause(
						Typescript.SyntaxKind.ExtendsKeyword,
						[
							Typescript.factory.createExpressionWithTypeArguments(
								Typescript.factory.createPropertyAccessExpression(
									Typescript.factory.createIdentifier("DModeling"),
									Typescript.factory.createIdentifier("ObjectTag"),
								),
								[
									Typescript.factory.createLiteralTypeNode(
										Typescript.factory.createStringLiteral(structure.name),
									),
								],
							),
						],
					),
				],
				objectTypeNode.members,
			),
		);

		return success(
			Typescript.factory.createTypeReferenceNode(identifier),
		);
	},
);
