import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("betweenThanConstraintTransformer", () => {
	it("renders positive and negative bounds", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.number([DDataStructure.betweenThan(1, 2)]), params),
			DStoTS.render(DDataStructure.number([DDataStructure.betweenThan(-2, -1)]), params),
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
			DDataStructure.number([DDataStructure.betweenThan(Number.NaN, 2)]),
			params,
		)).toThrowErrorMatchingSnapshot();
		expect(() => DStoTS.render(
			DDataStructure.number([DDataStructure.betweenThan(1, Number.NaN)]),
			params,
		)).toThrowErrorMatchingSnapshot();
	});
});
