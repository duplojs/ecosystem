import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("stringLiteralTypeTransformer", () => {
	it("renders a string literal type", () => {
		expect(DStoJS.render(
			DDataStructure.literal("value"),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders direct string literal constraints", () => {
		expect(DStoJS.render(
			DDataStructure.literal("value", [
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

	it("renders repeated string literal constraints with allOf", () => {
		expect(DStoJS.render(
			DDataStructure.literal("value", [
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

	it("renders standalone string literal pattern constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.email()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.uuid()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.notEmpty()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.trimmed()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.path()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.absolutePath()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [DDataStructure.segmentPath()]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.path(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.absolutePath(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.segmentPath(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.email(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.notEmpty(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal("value", [
				DDataStructure.regex(/^first$/),
				DDataStructure.trimmed(),
			]), params).definitions.Value,
		]).toMatchSnapshot();
	});
});
