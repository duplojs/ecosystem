import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("minElementsConstraintTransformer", () => {
	it("renders positive and negative minimums", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.minElements(2)]), params),
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.minElements(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite minimum", () => {
		expect(() => DStoTS.render(
			DDataStructure.array(DDataStructure.number(), [DDataStructure.minElements(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
