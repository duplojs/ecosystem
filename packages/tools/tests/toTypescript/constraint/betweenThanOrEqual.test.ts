import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("betweenThanOrEqualConstraintTransformer", () => {
	it("renders positive and negative inclusive bounds", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.number([DDataStructure.betweenThanOrEqual(1, 2)]), params),
			DStoTS.render(DDataStructure.number([DDataStructure.betweenThanOrEqual(-2, -1)]), params),
		]).toMatchSnapshot();
	});

	it("rejects non-finite bounds", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect(() => DStoTS.render(
			DDataStructure.number([DDataStructure.betweenThanOrEqual(Number.NaN, 2)]),
			params,
		)).toThrowErrorMatchingSnapshot();
		expect(() => DStoTS.render(
			DDataStructure.number([DDataStructure.betweenThanOrEqual(1, Number.NaN)]),
			params,
		)).toThrowErrorMatchingSnapshot();
	});
});
