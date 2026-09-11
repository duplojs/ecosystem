import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("arrayStructureTransformer", () => {
	it("renders array structures and constraints", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(DDataStructure.array(DDataStructure.string()), params),
			DStoJS.render(DDataStructure.array(DDataStructure.number([DDataStructure.integer()]), [
				DDataStructure.minElements(2),
				DDataStructure.maxElements(10),
				DDataStructure.arrayLengthEqual(4),
				DDataStructure.refine<readonly number[]>(() => true),
			]), params),
			DStoJS.render(
				DDataStructure.array(DDataStructure.string(), [DDataStructure.arrayLengthEqual(3)]),
				params,
			),
		]).toMatchSnapshot();
	});

	it("renders repeated array constraints with allOf", () => {
		const params = <const>{
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7",
		};

		expect([
			DStoJS.render(DDataStructure.array(DDataStructure.string(), [
				DDataStructure.minElements(1),
				DDataStructure.minElements(2),
				DDataStructure.minElements(3),
			]), params),
			DStoJS.render(DDataStructure.array(DDataStructure.string(), [
				DDataStructure.maxElements(5),
				DDataStructure.maxElements(4),
				DDataStructure.maxElements(3),
			]), params),
			DStoJS.render(DDataStructure.array(DDataStructure.string(), [
				DDataStructure.minElements(1),
				DDataStructure.arrayLengthEqual(2),
			]), params),
			DStoJS.render(DDataStructure.array(DDataStructure.string(), [
				DDataStructure.maxElements(4),
				DDataStructure.arrayLengthEqual(2),
			]), params),
			DStoJS.render(DDataStructure.array(DDataStructure.string(), [
				DDataStructure.minElements(1),
				DDataStructure.arrayLengthEqual(2),
				DDataStructure.arrayLengthEqual(3),
			]), params),
		]).toMatchSnapshot();
	});

	it("renders nested array payloads", () => {
		expect(DStoJS.render(
			DDataStructure.array(DDataStructure.object({
				sku: DDataStructure.string([DDataStructure.notEmpty()]),
				quantity: DDataStructure.number([
					DDataStructure.integer(),
					DDataStructure.greaterThanOrEqual(0),
				]),
				locations: DDataStructure.array(
					DDataStructure.literal(["warehouse", "store"]),
					[DDataStructure.minElements(1)],
				),
			}), [DDataStructure.minElements(1)]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toMatchSnapshot();
	});

	it("throws when the element structure is not supported", () => {
		expect(() => DStoJS.render(
			DDataStructure.array(DDataStructure.string()),
			{
				identifier: "Value",
				structureTransformers: [DStoJS.arrayStructureTransformer],
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		)).toThrowErrorMatchingSnapshot();
	});
});
