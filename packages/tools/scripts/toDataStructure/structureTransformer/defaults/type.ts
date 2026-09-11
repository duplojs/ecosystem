import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import { Typescript } from "@scripts/typescript";
import { createStructureTransformer } from "../create";

export const typeStructureTransformer = createStructureTransformer(
	DDataStructure.structureIdentifier(
		DDataStructure.typeStructureKind,
	),
	(
		structure,
		{
			transformConstraint,
			success,
		},
	) => {
		const constraints = transformConstraint(structure.definition.constraints);

		if (DEither.isLeft(constraints)) {
			return constraints;
		}

		const typeExpression = DPattern.match<DDataStructure.Types>(
			structure.definition.type satisfies DDataStructure.Type as never,
		)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.bigintTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("BigintType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.bigintLiteralTypeKind),
				(type) => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("BigintLiteralType"),
					),
					undefined,
					[Typescript.factory.createBigIntLiteral(`${type.definition.value.toString()}n`)],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.booleanTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("BooleanType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.booleanLiteralTypeKind),
				(type) => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("BooleanLiteralType"),
					),
					undefined,
					[
						type.definition.value
							? Typescript.factory.createTrue()
							: Typescript.factory.createFalse(),
					],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.dateTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("DateType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.nullTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("NullType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.numberTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("NumberType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.numberLiteralTypeKind),
				(type) => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("NumberLiteralType"),
					),
					undefined,
					[Typescript.factory.createNumericLiteral(type.definition.value)],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.stringTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("StringType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.stringLiteralTypeKind),
				(type) => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("StringLiteralType"),
					),
					undefined,
					[Typescript.factory.createStringLiteral(type.definition.value)],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.timeTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("TimeType"),
					),
					undefined,
					[],
				),
			)
			.when(
				DDataStructure.typeIdentifier(DDataStructure.undefinedTypeKind),
				() => Typescript.factory.createCallExpression(
					Typescript.factory.createPropertyAccessExpression(
						Typescript.factory.createIdentifier("DDataStructure"),
						Typescript.factory.createIdentifier("UndefinedType"),
					),
					undefined,
					[],
				),
			)
			.exhaustive();

		return success(
			Typescript.factory.createCallExpression(
				Typescript.factory.createPropertyAccessExpression(
					Typescript.factory.createIdentifier("DDataStructure"),
					Typescript.factory.createIdentifier("TypeStructure"),
				),
				undefined,
				[
					typeExpression,
					Typescript.factory.createArrayLiteralExpression(
						constraints,
						false,
					),
				],
			),
		);
	},
);
