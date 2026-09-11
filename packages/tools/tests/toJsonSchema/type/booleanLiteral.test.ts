import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("booleanLiteralTypeTransformer", () => {
	it("renders boolean literal types", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(DDataStructure.literal(true), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(false), params).definitions.Value,
		]).toMatchSnapshot();
	});
});
