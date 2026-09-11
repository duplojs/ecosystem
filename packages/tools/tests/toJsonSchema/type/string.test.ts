import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("stringTypeTransformer", () => {
	it("renders a string type", () => {
		expect(DStoJS.render(
			DDataStructure.string(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders direct string constraints", () => {
		expect(DStoJS.render(
			DDataStructure.string([
				DDataStructure.minCharacters(2),
				DDataStructure.maxCharacters(8),
				DDataStructure.stringLengthEqual(4),
				DDataStructure.url(),
				DDataStructure.email(),
				DDataStructure.uuid(),
				DDataStructure.notEmpty(),
				DDataStructure.trimmed(),
				DDataStructure.regex(/^value$/),
				DDataStructure.refine<string>(() => true),
				DDataStructure.path(),
				DDataStructure.absolutePath(),
				DDataStructure.segmentPath(),
			]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders repeated string constraints with allOf", () => {
		expect(DStoJS.render(
			DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.regex(/^second$/),
				DDataStructure.email(),
				DDataStructure.uuid(),
				DDataStructure.notEmpty(),
				DDataStructure.trimmed(),
			]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders standalone string pattern constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(DDataStructure.string([DDataStructure.email()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.uuid()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.notEmpty()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.trimmed()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.path()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.absolutePath()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([DDataStructure.segmentPath()]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.path(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.absolutePath(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.segmentPath(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.email(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.notEmpty(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.trimmed(),
			]), params).definitions.Value,
		]).toMatchSnapshot();
	});
});
