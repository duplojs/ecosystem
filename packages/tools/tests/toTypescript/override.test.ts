import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DStoTS from "@scripts/toTypescript";
import { Typescript } from "@scripts/typescript";

describe("toTypescript override", () => {
	it("adds override metadata without mutating the source structure", () => {
		const sourceStructure = DDataStructure.string();
		const structure = sourceStructure
			.addIdentifier("ExternalValue")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("ExternalType"),
			)
			.addMapImportContextEntries(
				["namespace-package", { namespace: ["NamespaceValue"] }],
				["default-package", { default: ["DefaultValue"] }],
				["direct-package", { direct: ["ExternalType"] }],
			);

		expect(sourceStructure.definition.identifier).toBeUndefined();
		expect(sourceStructure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(sourceStructure.definition.mapImportContextEntries).toBeUndefined();
		expect(structure).not.toBe(sourceStructure);
		expect(DStoTS.render(
			DDataStructure.array(structure),
			{
				identifier: "Values",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("sets override metadata on the current structure", () => {
		const structure = DDataStructure.string()
			.setIdentifier("CurrentValue")
			.setMapImportContextEntries([
				"direct-package",
				{ direct: ["CurrentType"] },
			])
			.setOverrideTypescriptTransformer(
				(_currentStructure, { success }) => success(
					Typescript.factory.createTypeReferenceNode("CurrentType"),
				),
			);

		expect(structure.definition.identifier).toBe("CurrentValue");
		expect(DStoTS.render(
			structure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("delegates to the standard transformer", () => {
		const structure = DDataStructure.string()
			.addOverrideTypescriptTransformer(
				(currentStructure, { transformer }) => transformer(currentStructure),
			);

		expect(DStoTS.render(
			structure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("renders a product sheet with overridden external models", () => {
		const productRow = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
			name: DDataStructure.string(),
		})
			.addIdentifier("ProductRow")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("CatalogProductRow"),
			)
			.addMapImportContextEntries(
				["@acme/catalog", { direct: ["CatalogProductRow"] }],
			);

		const money = DModeling.NewTypeStructure(
			"Money",
			DDataStructure.number([DDataStructure.greaterThanOrEqual(0)]),
			[],
		)
			.addIdentifier("Money")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("MoneyAmount"),
			)
			.addMapImportContextEntries(
				["@acme/money", { direct: ["MoneyAmount"] }],
			);

		const stockLine = DDataStructure.object({
			available: DDataStructure.number([DDataStructure.integer()]),
			reserved: DDataStructure.number([DDataStructure.integer()]),
		})
			.addIdentifier("StockLine")
			.addOverrideTypescriptTransformer(
				(_currentStructure, { addImport, success }) => {
					addImport("@acme/stock", "ExternalStockLine", "direct");

					return success(
						Typescript.factory.createTypeReferenceNode("ExternalStockLine"),
					);
				},
			);

		expect(DStoTS.render(
			DDataStructure.object({
				product: productRow,
				price: money,
				discountPrice: DDataStructure.optional(money),
				stockByWarehouse: DDataStructure.record(
					DDataStructure.literal(["main", "outlet"]),
					stockLine,
				),
				relatedProducts: DDataStructure.array(productRow),
			}),
			{
				identifier: "ProductSheet",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("sets import metadata on the current structure", () => {
		const structure = DDataStructure.string()
			.setIdentifier("ExternalSku")
			.setMapImportContextEntries(
				["@acme/sku", { direct: ["SkuValue"] }],
			)
			.setOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("SkuValue"),
			);

		expect(structure.definition.mapImportContextEntries).toEqual([["@acme/sku", { direct: ["SkuValue"] }]]);
		expect(DStoTS.render(
			DDataStructure.object({
				sku: structure,
			}),
			{
				identifier: "SkuContainer",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("removes an override with null", () => {
		const structure = DDataStructure.string()
			.setOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("ExternalType"),
			)
			.setOverrideTypescriptTransformer(null);
		const clonedStructure = structure.addOverrideTypescriptTransformer(null);

		expect(structure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(clonedStructure.definition.overrideTypescriptTransformer).toBeUndefined();
		expect(clonedStructure).not.toBe(structure);
		expect(DStoTS.render(
			clonedStructure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toMatchSnapshot();
	});

	it("does not create an alias when root identifier matches structure identifier", () => {
		const structure = DDataStructure.string()
			.setIdentifier("SameValue");

		const rendered = DStoTS.render(
			structure,
			{
				identifier: "SameValue",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		);

		const exportLines = rendered.split("\n").filter((line) => line.startsWith("export type"));
		expect(exportLines).toHaveLength(1);
	});

	it("throws when no structure transformer supports the data structure", () => {
		const unsupportedStructure = {
			[DDataStructure.structureKind.runTimeKey]: null,
			definition: {},
		} as unknown as DDataStructure.Structure;

		expect(() => DStoTS.render(
			unsupportedStructure,
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
