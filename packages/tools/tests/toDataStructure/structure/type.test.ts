import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoDS, DStoTS } from "@scripts";

describe("typeStructureTransformer", () => {
	it("renders primitive and literal business values", () => {
		const featureFlagSnapshot = DDataStructure.object({
			label: DDataStructure.string([DDataStructure.notEmpty()]),
			revision: DDataStructure.number(),
			stableRevision: DDataStructure.literal(2),
			enabled: DDataStructure.boolean(),
			defaultEnabled: DDataStructure.literal(true),
			manualReview: DDataStructure.literal(false),
			createdAt: DDataStructure.date(),
			refreshAt: DDataStructure.time(),
			rawVersion: DDataStructure.bigint(),
			expectedVersion: DDataStructure.literal(1n),
			deletedAt: DDataStructure.null(),
			deprecatedValue: DDataStructure.undefined(),
			status: DDataStructure.literal("active"),
		});

		expect(DStoDS.render(featureFlagSnapshot, {
			identifier: "FeatureFlagSnapshot",
			structureTransformers: [DStoDS.objectStructureTransformer, DStoDS.typeStructureTransformer],
			constraintTransformers: DStoDS.defaultConstraintTransformers,
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toMatchSnapshot();
	});

	it("propagates unsupported type constraints", () => {
		expect(() => DStoDS.render(DDataStructure.string([DDataStructure.notEmpty()]), {
			identifier: "TypeValue",
			structureTransformers: [DStoDS.typeStructureTransformer],
			constraintTransformers: [],
			toTypescript: {
				typeTransformers: DStoTS.defaultTypeTransformers,
				structureTransformers: DStoTS.defaultStructureTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		})).toThrowErrorMatchingSnapshot();
	});
});
