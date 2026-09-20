import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("timeTypeTransformer", () => {
	it("renders a time type as its transported string formats", () => {
		expect(DStoJS.render(
			DDataStructure.time(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
