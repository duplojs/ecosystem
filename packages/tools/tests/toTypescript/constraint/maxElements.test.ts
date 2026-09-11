import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("maxElementsConstraintTransformer", () => {
	it("renders positive and negative maximums", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.maxElements(2)]), params),
			DStoTS.render(DDataStructure.array(DDataStructure.number(), [DDataStructure.maxElements(-2)]), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite maximum", () => {
		expect(() => DStoTS.render(
			DDataStructure.array(DDataStructure.number(), [DDataStructure.maxElements(Number.NaN)]),
			{
				identifier: "Value",
				structureTransformers: DStoTS.defaultStructureTransformers,
				typeTransformers: DStoTS.defaultTypeTransformers,
				constraintTransformers: DStoTS.defaultConstraintTransformers,
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
