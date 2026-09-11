import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoTS } from "@scripts";

describe("numberLiteralTypeTransformer", () => {
	const params = {
		identifier: "Value",
		structureTransformers: DStoTS.defaultStructureTransformers,
		typeTransformers: DStoTS.defaultTypeTransformers,
		constraintTransformers: DStoTS.defaultConstraintTransformers,
	};

	it("renders positive and negative number literals", () => {
		expect([
			DStoTS.render(DDataStructure.literal(42), params),
			DStoTS.render(DDataStructure.literal(-42), params),
		]).toMatchSnapshot();
	});

	it("rejects a non-finite number literal", () => {
		expect(() => DStoTS.render(
			DDataStructure.literal(Number.POSITIVE_INFINITY),
			params,
		)).toThrowErrorMatchingSnapshot();
	});
});
