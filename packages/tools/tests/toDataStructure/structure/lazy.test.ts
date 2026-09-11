import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("lazyStructureTransformer", () => {
	it("renders a recursive catalog tree with nested lazy structures", () => {
		interface CatalogFacet {
			readonly name: string;
			readonly children: readonly CatalogFacet[];
		}

		interface CatalogCategory {
			readonly slug: string;
			readonly parent: CatalogCategory | null;
			readonly facets: readonly CatalogFacet[];
			readonly children: readonly CatalogCategory[];
		}

		const catalogFacet: DDataStructure.Structure<CatalogFacet> = DDataStructure.object({
			name: DDataStructure.string([DDataStructure.notEmpty()]),
			children: DDataStructure.array(DDataStructure.lazy(() => catalogFacet)),
		}).addIdentifier("CatalogFacet");
		const catalogCategory: DDataStructure.Structure<CatalogCategory> = DDataStructure.object({
			slug: DDataStructure.string([DDataStructure.segmentPath()]),
			parent: DDataStructure.union([
				DDataStructure.null(),
				DDataStructure.lazy(() => catalogCategory),
			]),
			facets: DDataStructure.array(DDataStructure.lazy(() => catalogFacet)),
			children: DDataStructure.array(DDataStructure.lazy(() => catalogCategory)),
		}).addIdentifier("CatalogCategory");

		expect(DStoDS.render(catalogCategory, {
			identifier: "RenderedCatalogCategory",
			structureTransformers: [
				DStoDS.arrayStructureTransformer,
				DStoDS.lazyStructureTransformer,
				DStoDS.objectStructureTransformer,
				DStoDS.typeStructureTransformer,
				DStoDS.unionStructureTransformer,
			],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("propagates unsupported lazy getter and constraints", () => {
		const unsupportedGetter = () => DStoDS.render(DDataStructure.lazy(() => DDataStructure.string()), {
			identifier: "LazyValue",
			structureTransformers: [DStoDS.lazyStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		});
		const unsupportedConstraint = () => DStoDS.render(
			DDataStructure.lazy(() => DDataStructure.string(), [DDataStructure.minElements(1) as never]),
			{
				identifier: "LazyValue",
				structureTransformers: [DStoDS.lazyStructureTransformer, DStoDS.typeStructureTransformer],
				constraintTransformers: [],
				toTypescript: {
					typeTransformers: DStoTS.defaultTypeTransformers,
					structureTransformers: DStoTS.defaultStructureTransformers,
					constraintTransformers: DStoTS.defaultConstraintTransformers,
				},
			},
		);

		expect([unsupportedGetter, unsupportedConstraint].map((renderStructure) => {
			try {
				return renderStructure();
			} catch (error) {
				return error;
			}
		})).toMatchSnapshot();
	});
});
