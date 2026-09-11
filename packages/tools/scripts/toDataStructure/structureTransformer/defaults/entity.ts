import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const entityStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DModeling.entityStructureKind,
	),
	(
		structure,
		{
			transformer,
			success,
			addImport,
		},
	) => {
		const entries = DCommon.pipe(
			structure.definition.inner.value.definition.shape.value,
			DArray.reduce(
				DArray.reduceFrom<Typescript.PropertyAssignment[]>([]),
				({
					element,
					lastValue,
					next,
					nextPush,
					exit,
				}) => {
					if (element.key === DModeling.entityKind.runTimeKey) {
						return next(lastValue);
					}

					return DCommon.pipe(
						element.value,
						transformer,
						DCommon.when(
							DEither.isLeft,
							exit,
						),
						DEither.whenIsRight(
							(value) => nextPush(
								lastValue,
								Typescript.factory.createPropertyAssignment(
									Typescript.factory.createIdentifier(element.key),
									value,
								),
							),
						),
					);
				},
			),
		);

		if (DEither.isLeft(entries)) {
			return entries;
		}

		addImport("@duplojs/lang/modeling", "DModeling", "namespace");

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DModeling"),
					Typescript.factory.createIdentifier("EntityStructure"),
				),
				undefined,
				[
					Typescript.factory.createStringLiteral(structure.name),
					Typescript.factory.createArrowFunction(
						undefined,
						undefined,
						[],
						undefined,
						Typescript.factory.createToken(Typescript.SyntaxKind.EqualsGreaterThanToken),
						Typescript.factory.createParenthesizedExpression(
							Typescript.factory.createObjectLiteralExpression(
								entries,
								false,
							),
						),
					),
				],
			),
		);
	},
);
