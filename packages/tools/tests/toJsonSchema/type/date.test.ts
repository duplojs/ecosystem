import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("dateTypeTransformer", () => {
	it("renders a date type as its transported string formats", () => {
		expect(DStoJS.render(
			DDataStructure.date(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
