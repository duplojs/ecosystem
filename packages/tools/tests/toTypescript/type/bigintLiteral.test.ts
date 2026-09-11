import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("bigintLiteralTypeTransformer", () => {
	it("renders positive and negative bigint literals", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoTS.defaultStructureTransformers,
			typeTransformers: DStoTS.defaultTypeTransformers,
			constraintTransformers: DStoTS.defaultConstraintTransformers,
		};

		expect([
			DStoTS.render(DDataStructure.literal(42n), params),
			DStoTS.render(DDataStructure.literal(-42n), params),
		]).toMatchSnapshot();
	});
});
