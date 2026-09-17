import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DStoDS, DStoTS, Typescript } from "@scripts";

describe("createTypeTransformer", () => {
	it("creates a type transformer used by render", () => {
		const transformer = DStoDS.createTypeTransformer(
			DDataStructure.typeIdentifier(DDataStructure.stringLiteralTypeKind),
			(
				type,
				{ success },
			) => {
				type _CheckType = DCommon.ExpectType<
					typeof type,
					DDataStructure.StringLiteralType,
					"strict"
				>;

				return success(
					Typescript.factory.createCallExpression(
						Typescript.factory.createPropertyAccessExpression(
							Typescript.factory.createIdentifier("DDataStructure"),
							Typescript.factory.createIdentifier("StringLiteralType"),
						),
						undefined,
						[Typescript.factory.createStringLiteral(`custom:${type.definition.value}`)],
					),
				);
			},
		);

		expect(DStoDS.render(DDataStructure.literal("sku"), {
			identifier: "CustomStringLiteral",
			typeTransformers: [transformer],
			structureTransformers: [DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("does not invoke the builder for an unsupported type", () => {
		const builder: DStoDS.TypeTransformerBuildFunction<DDataStructure.StringLiteralType> = vi.fn(
			(_type, { buildError }) => buildError(),
		);
		const transformer = DStoDS.createTypeTransformer(
			(type) => DDataStructure.typeIdentifier(
				type,
				DDataStructure.stringLiteralTypeKind,
			),
			builder,
		);
		const structure = DDataStructure.number();

		try {
			DStoDS.render(structure, {
				identifier: "UnsupportedNumber",
				typeTransformers: [transformer],
				structureTransformers: [DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			});

			expect.unreachable();
		} catch (error) {
			expect(error).toBeInstanceOf(DStoDS.DataStructureToDataStructureRenderError);

			if (!(error instanceof DStoDS.DataStructureToDataStructureRenderError)) {
				return;
			}

			expect(DEither.unwrapByInformationOrThrow(
				error.error,
				"dataStructureTypeNotSupport",
			)).toBe(structure.definition.type);
		}

		expect(builder).not.toHaveBeenCalled();
	});
});
