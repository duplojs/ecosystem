import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("greaterThanOrEqualConstraintTransformer", () => {
	it("renders positive and negative thresholds", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.number([DDataStructure.greaterThanOrEqual(2)]), params),
			DStoTS.render(DDataStructure.number([DDataStructure.greaterThanOrEqual(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite threshold", () => {
		expect(() => DStoTS.render(
			DDataStructure.number([DDataStructure.greaterThanOrEqual(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
