import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DStoJS } from "@scripts";

describe("numberLiteralTypeTransformer", () => {
	it("renders a number literal type", () => {
		expect(DStoJS.render(
			DDataStructure.literal(42),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders direct number literal constraints", () => {
		expect(DStoJS.render(
			DDataStructure.literal(42, [
				DDataStructure.integer(),
				DDataStructure.multipleOf(2),
				DDataStructure.negative(),
				DDataStructure.notZero(),
				DDataStructure.positive(),
				DDataStructure.safe(),
				DDataStructure.strictNegative(),
				DDataStructure.strictPositive(),
				DDataStructure.betweenThan(1, 9),
				DDataStructure.betweenThanOrEqual(2, 8),
				DDataStructure.greaterThan(3),
				DDataStructure.greaterThanOrEqual(4),
				DDataStructure.lessThan(7),
				DDataStructure.lessThanOrEqual(6),
				DDataStructure.refine<number>(() => true),
			]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders repeated number literal constraints with allOf and anyOf", () => {
		expect(DStoJS.render(
			DDataStructure.literal(42, [
				DDataStructure.lessThanOrEqual(10),
				DDataStructure.negative(),
				DDataStructure.greaterThanOrEqual(1),
				DDataStructure.positive(),
				DDataStructure.lessThan(9),
				DDataStructure.strictNegative(),
				DDataStructure.greaterThan(2),
				DDataStructure.strictPositive(),
				DDataStructure.betweenThan(3, 8),
				DDataStructure.betweenThan(4, 7),
				DDataStructure.betweenThanOrEqual(5, 6),
				DDataStructure.betweenThanOrEqual(5, 5),
				DDataStructure.notZero(),
				DDataStructure.notZero(),
				DDataStructure.safe(),
				DDataStructure.safe(),
			]),
			{
				identifier: "Value",
				structureTransformers: DStoJS.defaultStructureTransformers,
				typeTransformers: DStoJS.defaultTypeTransformers,
				version: "jsonSchema7",
			},
		).definitions.Value).toMatchSnapshot();
	});

	it("renders repeated number literal bounds with and without an existing allOf", () => {
		const params = {
			identifier: "Value",
			structureTransformers: DStoJS.defaultStructureTransformers,
			typeTransformers: DStoJS.defaultTypeTransformers,
			version: "jsonSchema7" as const,
		};

		expect([
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.safe(),
				DDataStructure.lessThanOrEqual(10),
				DDataStructure.negative(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.greaterThanOrEqual(1),
				DDataStructure.positive(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.lessThan(10),
				DDataStructure.strictNegative(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.greaterThan(1),
				DDataStructure.strictPositive(),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.lessThan(10),
				DDataStructure.betweenThan(1, 9),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.lessThanOrEqual(10),
				DDataStructure.betweenThanOrEqual(1, 9),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.greaterThan(1),
				DDataStructure.greaterThan(2),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.greaterThanOrEqual(1),
				DDataStructure.greaterThanOrEqual(2),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.lessThan(10),
				DDataStructure.lessThan(9),
			]), params).definitions.Value,
			DStoJS.render(DDataStructure.literal(42, [
				DDataStructure.lessThanOrEqual(10),
				DDataStructure.lessThanOrEqual(9),
			]), params).definitions.Value,
		]).toMatchSnapshot();
	});
});
