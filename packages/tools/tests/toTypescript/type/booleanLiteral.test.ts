import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("booleanLiteralTypeTransformer", () => {
	it("renders true and false literals", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.literal(true), params),
			DStoTS.render(DDataStructure.literal(false), params),
		]).toMatchSnapshot();
	});
});
