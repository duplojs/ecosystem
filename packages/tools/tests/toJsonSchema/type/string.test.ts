import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DataStructureToJsonSchema } from "@scripts";

describe("stringTypeTransformer", () => {
	it("renders a string type", () => {
		expect(DataStructureToJsonSchema.render(
			DDataStructure.string(),
			{
				identifier: "Value",
				structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
				typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders direct string constraints", () => {
		expect(DataStructureToJsonSchema.render(
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
				structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
				typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders repeated string constraints with allOf", () => {
		expect(DataStructureToJsonSchema.render(
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
				structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
				typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders standalone string pattern constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.email()]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.uuid()]), params).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.notEmpty()]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.trimmed()]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.path()]), params).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.absolutePath()]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.segmentPath()]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.path(),
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.absolutePath(),
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.segmentPath(),
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.email(),
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.notEmpty(),
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/^first$/),
				DDataStructure.trimmed(),
			]), params).definitions.Value,
		]).toMatchSnapshot();
	});
	it.each([
		{
			name: "startsWith",
			constraint: DDataStructure.startsWith("asset:"),
		},
		{
			name: "endsWith",
			constraint: DDataStructure.endsWith(".json"),
		},
		{
			name: "include",
			constraint: DDataStructure.include("/lang/"),
		},
	])("renders $name alone and alongside existing patterns", ({ constraint }) => {
		const params = {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DataStructureToJsonSchema.render(DDataStructure.string([constraint]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/existing/),
				constraint,
			]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([
				DDataStructure.regex(/existing/),
				DDataStructure.regex(/another/),
				constraint,
			]), params).definitions.Value,
		]).toMatchSnapshot();
	});

	it("renders empty literal string constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.startsWith("")]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.endsWith("")]), params).definitions.Value,
			DataStructureToJsonSchema.render(DDataStructure.string([DDataStructure.include("")]), params).definitions.Value,
		]).toMatchSnapshot();
	});

	it("renders escaped literal patterns with Unicode and newlines", () => {
		const searchString = ".*+?^${}()|[]\\-/\"`é😀\n";
		const params = {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.startsWith(searchString)]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.endsWith(searchString)]),
				params,
			).definitions.Value,
			DataStructureToJsonSchema.render(
				DDataStructure.string([DDataStructure.include(searchString)]),
				params,
			).definitions.Value,
		]).toMatchSnapshot();
	});

	it("renders combined literal and regex constraints", () => {
		const structure = DDataStructure.string([
			DDataStructure.startsWith("asset:"),
			DDataStructure.endsWith(".json"),
			DDataStructure.include("/lang/"),
			DDataStructure.regex(/^[a-z:/.]+$/),
		]);
		const result = DataStructureToJsonSchema.render(structure, {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		}).definitions.Value;

		expect(result).toMatchSnapshot();
	});

	it("renders a prefix after an empty inclusion pattern", () => {
		const structure = DDataStructure.string([
			DDataStructure.include(""),
			DDataStructure.startsWith("asset:"),
		]);
		const result = DataStructureToJsonSchema.render(structure, {
			identifier: "Value",
			structureTransformers: DataStructureToJsonSchema.defaultStructureTransformers,
			typeTransformers: DataStructureToJsonSchema.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		}).definitions.Value;

		expect(result).toMatchSnapshot();
	});
});
