import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS, Typescript } from "@scripts";

describe("recordStructureTransformer", () => {
	it("renders required and partial records", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};
		const widenedKey = DDataStructure.literal("key")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createKeywordTypeNode(
					Typescript.SyntaxKind.StringKeyword,
				),
			);
		const mixedUnionKey = DDataStructure.literal("key")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createUnionTypeNode([
					Typescript.factory.createLiteralTypeNode(
						Typescript.factory.createStringLiteral("key"),
					),
					Typescript.factory.createKeywordTypeNode(
						Typescript.SyntaxKind.NumberKeyword,
					),
				]),
			);
		const optionalStringKey = DDataStructure.optional(DDataStructure.string()) as never;
		const optionalLiteralKey = DDataStructure.optional(DDataStructure.literal("key")) as never;
		const optionalUndefinedKey = DDataStructure.optional(DDataStructure.undefined()) as never;

		expect([
			DStoTS.render(DDataStructure.record(DDataStructure.literal("key"), DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(
				DDataStructure.union([
					DDataStructure.literal("first"),
					DDataStructure.literal("second"),
				]),
				DDataStructure.number(),
			), params),
			DStoTS.render(DDataStructure.record(DDataStructure.string(), DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(optionalStringKey, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(optionalLiteralKey, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(optionalUndefinedKey, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(DDataStructure.undefined() as never, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(widenedKey, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(mixedUnionKey, DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(DDataStructure.union([] as never), DDataStructure.number()), params),
			DStoTS.render(DDataStructure.record(DDataStructure.literal("key"), DDataStructure.optional(DDataStructure.number())), params),
		]).toMatchSnapshot();
	});

	it("renders an inventory record projection", () => {
		expect(DStoTS.render(
			DDataStructure.record(
				DDataStructure.literal(["main", "outlet", "supplier"]),
				DDataStructure.object({
					available: DDataStructure.number([
						DDataStructure.integer(),
						DDataStructure.greaterThanOrEqual(0),
					]),
					reserved: DDataStructure.number([
						DDataStructure.integer(),
						DDataStructure.greaterThanOrEqual(0),
					]),
					nextRestock: DDataStructure.union([
						DDataStructure.string(),
						DDataStructure.null(),
					]),
				}),
			),
			{
				identifier: "InventoryByLocation",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("renders a partial dynamic metadata record", () => {
		expect(DStoTS.render(
			DDataStructure.record(
				DDataStructure.string(),
				DDataStructure.union([
					DDataStructure.string(),
					DDataStructure.number(),
					DDataStructure.boolean(),
					DDataStructure.undefined(),
				]),
			),
			{
				identifier: "ProductMetadata",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("propagates an unsupported key", () => {
		expect(() => DStoTS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("propagates an unsupported value", () => {
		expect(() => DStoTS.render(
			DDataStructure.record(DDataStructure.string(), DDataStructure.number()),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: [DStoTS.stringTypeTransformer],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("with identifier structure", () => {
		const structure = DDataStructure.record(DDataStructure.string(), DDataStructure.number())
			.addIdentifier("Test");

		expect(DStoTS.render(structure, {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		})).toMatchSnapshot();
	});
});
