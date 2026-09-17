import * as DSDataStructure from "@duplojs/server/dataStructure";
import { DStoJS } from "@scripts";

describe("fileTypeTransformer", () => {
	it("renders a file type", () => {
		expect(DStoJS.render(
			DSDataStructure.file(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
