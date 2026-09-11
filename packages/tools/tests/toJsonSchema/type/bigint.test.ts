import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("bigintTypeTransformer", () => {
	it("renders a bigint type as an integer schema", () => {
		expect(DStoJS.render(
			DDataStructure.bigint(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
