import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("typeStructureTransformer", () => {
	it("renders a wrapped type structure", () => {
		expect(DStoJS.render(
			DDataStructure.string([DDataStructure.minCharacters(3)]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when the inner type is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.string(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: [],
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
