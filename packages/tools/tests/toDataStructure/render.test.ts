import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DStoDS, DStoTS, Typescript } from "@scripts";

describe("toDataStructure render", () => {
	it("applies hooks and import metadata while rendering a shared structure", () => {
		const externalProduct = DDataStructure.object({
			sku: DDataStructure.string([DDataStructure.notEmpty()]),
		}).addMapImportContextEntries(
			["@acme/catalog", { direct: ["CatalogMarker"] }],
		);
		const identifiedExternalProduct = externalProduct.addIdentifier("ExternalProduct");
		const catalogPage = DDataStructure.object({
			primaryProduct: externalProduct,
			secondaryProduct: externalProduct,
		});

		expect(DStoDS.render(catalogPage, {
			identifier: "CatalogPage",
			structureTransformers: [
				DStoDS.objectStructureTransformer,
				DStoDS.typeStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			hooks: [
				({ structure, output }) => {
					if (structure === externalProduct) {
						return output("next", identifiedExternalProduct);
					}

					return output("next", structure);
				},
				({ structure, output }) => {
					if (structure.definition.identifier === "ExternalProduct") {
						return output("stop", structure);
					}

					return output("next", structure);
				},
			],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("tracks imports on the latest identified structure context", () => {
		const externalRule = DDataStructure.notEmpty()
			.addOverrideConstraintTransformer(
				(_constraint, { addImport, success }) => {
					addImport("@acme/rules", "ExternalRule");

					return success(
						Typescript.factory.createCallExpression(
							Typescript.factory.createIdentifier("ExternalRule"),
							undefined,
							[],
						),
					);
				},
			);
		const child = DDataStructure.string([externalRule])
			.addIdentifier("ExternalChild")
			.addMapImportContextEntries(
				["@acme/child", { direct: ["ChildMarker"] }],
			);
		const root = DDataStructure.object({
			child,
		}).addMapImportContextEntries(
			["@acme/root", { direct: ["RootMarker"] }],
		);

		const result = DStoDS.buildContext(root, {
			identifier: "Root",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});

		expect(DEither.isRight(result)).toBe(true);

		if (DEither.isLeft(result)) {
			throw new Error("Expected the data structure context to be built.");
		}

		const context = DEither.unwrapRight(result).context;
		const rootContext = [...context.values()].find(
			(value) => value.identifier.text === "rootDataStructure",
		);
		const childContext = context.get(child);

		expect(rootContext && Array.from(rootContext.import)).toStrictEqual([
			[
				"@duplojs/lang/dataStructure",
				{
					namespace: ["DDataStructure"],
				},
			],
			[
				"@acme/root",
				{
					direct: ["RootMarker"],
				},
			],
		]);
		expect(childContext && Array.from(childContext.import)).toStrictEqual([
			[
				"@duplojs/lang/dataStructure",
				{
					namespace: ["DDataStructure"],
				},
			],
			[
				"@acme/child",
				{
					direct: ["ChildMarker"],
				},
			],
			[
				"@acme/rules",
				{
					direct: ["ExternalRule"],
				},
			],
		]);
	});

	it("merges data structure and TypeScript import contexts when rendering", () => {
		const sharedDataStructureImports = {
			direct: ["DataStructureImport"],
			namespace: ["DataStructureNamespace"],
		};
		const directOnlyDataStructureImports = {
			direct: ["FirstDirectImport"],
		};
		const typescriptImportContext: DStoTS.MapImportContext = new Map();
		typescriptImportContext.set("@acme/shared", {
			default: ["TypescriptDefault"],
			direct: ["TypescriptImport"],
		});
		typescriptImportContext.set("@acme/direct-only", {
			direct: ["SecondDirectImport"],
		});
		const structure = DDataStructure.string()
			.addMapImportContextEntries(
				["@acme/shared", sharedDataStructureImports],
				["@acme/direct-only", directOnlyDataStructureImports],
			);

		expect(DStoDS.render(structure, {
			identifier: "SharedValue",
			structureTransformers: DStoDS.defaultStructureTransformers,
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
				importContext: typescriptImportContext,
			},
		})).toMatchSnapshot();
	});

	it("throws when no constraint transformer supports a constraint", () => {
		expect(() => DStoDS.render(
			DDataStructure.string([DDataStructure.notEmpty()]),
			{
				identifier: "CustomerName",
				structureTransformers: [DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("throws when a constraint transformer fails", () => {
		expect(() => DStoDS.render(
			DDataStructure.string([DDataStructure.notEmpty()]),
			{
				identifier: "CustomerName",
				structureTransformers: [DStoDS.typeStructureTransformer],
				constraintTransformers: [(_constraint, { buildError }) => buildError()],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		)).toThrowErrorMatchingSnapshot();
	});

	it("throws when recursive type rendering is unsupported", () => {
		interface StockCategory {
			readonly name: string;
			readonly children: readonly StockCategory[];
		}

		const stockCategory: DDataStructure.Structure<StockCategory> = DDataStructure.object({
			name: DDataStructure.string(),
			children: DDataStructure.array(DDataStructure.lazy(() => stockCategory)),
		});

		expect(() => DStoDS.render(stockCategory, {
			identifier: "StockCategory",
			structureTransformers: [
				DStoDS.arrayStructureTransformer,
				DStoDS.lazyStructureTransformer,
				DStoDS.objectStructureTransformer,
				DStoDS.typeStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: [],
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});
});
