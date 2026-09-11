import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("bigintLiteralTypeTransformer", () => {
	it("renders a bigint literal type as an integer schema", () => {
		expect(DStoJS.render(
			DDataStructure.literal(42n),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});
});
