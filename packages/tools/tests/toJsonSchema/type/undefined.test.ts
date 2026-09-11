import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("undefinedTypeTransformer", () => {
	it("renders an undefined type as an impossible schema", () => {
		expect(DStoJS.render(
			DDataStructure.undefined(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
