import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("nonEncodableStringStructureTransformer", () => {
	it("renders a non encodable string structure", () => {
		expect(DStoJS.render(
			DDataStructure.NonEncodableStringStructure("opaque"),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});
});
