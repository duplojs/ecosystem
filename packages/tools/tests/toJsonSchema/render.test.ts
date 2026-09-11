import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DStoJS from "@scripts/toJsonSchema";

describe("toJsonSchema render", () => {
	it("renders json schema 2020-12 output", () => {
		expect(DStoJS.render(
			DDataStructure.object({
				id: DDataStructure.string([DDataStructure.uuid()]),
				stock: DDataStructure.number([
					DDataStructure.integer(),
					DDataStructure.greaterThanOrEqual(0),
				]),
			}),
			{
				identifier: "ProductStock",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema202012",
			},
		)).toMatchSnapshot();
	});

	it("renders open api 3 output", () => {
		expect(DStoJS.render(
			DDataStructure.object({
				email: DDataStructure.string([DDataStructure.email()]),
				active: DDataStructure.boolean(),
			}),
			{
				identifier: "CustomerContact",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "openApi3",
			},
		)).toMatchSnapshot();
	});

	it("applies hooks until one stops the transformation", () => {
		expect(DStoJS.render(
			DDataStructure.string(),
			{
				identifier: "HookedValue",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				hooks: [
					({ output }) => output(
						"next",
						DDataStructure.number([DDataStructure.integer()]),
					),
					({ output }) => output("stop", DDataStructure.boolean()),
					({ output }) => output("next", DDataStructure.null()),
				],
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("ignores context declarations without schema", () => {
		const declaredOnly = DDataStructure.string().addIdentifier("DeclaredOnly");
		const context: DStoJS.MapContext = new Map([[declaredOnly, { name: "DeclaredOnly" }]]);

		expect(DStoJS.render(
			DDataStructure.boolean(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				context,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when a type transformer builds an error", () => {
		expect(() => DStoJS.render(
			DDataStructure.string(),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: [(_type, _constraints, { buildError }) => buildError()],
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
