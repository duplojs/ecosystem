import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { defaultConstraintTransformers, defaultStructureTransformers, defaultTypeTransformers, render } from "@duplojs/tools/toTypescript";
import { Typescript } from "@duplojs/tools/typescript";

describe("toTypescript integration", () => {
	it("renders a number with its constraints", () => {
		const result = render(
			DDataStructure.number([
				DDataStructure.integer(),
				DDataStructure.positive(),
			]),
			{
				identifier: "Score",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"import * as DNumber from \"@duplojs/lang/number\";",
				"",
				"export type Score = number & DNumber.Integer & DNumber.Positive;",
			].join("\n"),
		);
	});

	it("renders a string without constraints", () => {
		const result = render(
			DDataStructure.string(),
			{
				identifier: "Name",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe("export type Name = string;");
	});

	it("renders every string constraint", () => {
		const result = render(
			DDataStructure.string([
				DDataStructure.allowedCharacters(["a-z", "0-9"]),
				DDataStructure.email(),
				DDataStructure.maxCharacters(50),
				DDataStructure.minCharacters(3),
				DDataStructure.notEmpty(),
				DDataStructure.stringLengthEqual(10),
				DDataStructure.url(),
				DDataStructure.uuid(),
			]),
			{
				identifier: "ConstrainedString",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"import * as DString from \"@duplojs/lang/string\";",
				"",
				"export type ConstrainedString = string & (DString.AllowedCharacters<\"a-z\"> & DString.AllowedCharacters<\"0-9\">) & DString.Email & DString.MaxCharacters<50> & DString.MinCharacters<3> & DString.NotEmpty & DString.LengthEqual<10> & DString.Url & DString.Uuid;",
			].join("\n"),
		);
	});

	it("renders every number constraint", () => {
		const result = render(
			DDataStructure.number([
				DDataStructure.betweenThan(-10, 10),
				DDataStructure.betweenThanOrEqual(-20, 20),
				DDataStructure.even(),
				DDataStructure.greaterThan(-5),
				DDataStructure.greaterThanOrEqual(-4),
				DDataStructure.integer(),
				DDataStructure.lessThan(5),
				DDataStructure.lessThanOrEqual(4),
				DDataStructure.multipleOf(2),
				DDataStructure.negative(),
				DDataStructure.notZero(),
				DDataStructure.odd(),
				DDataStructure.positive(),
				DDataStructure.safe(),
				DDataStructure.strictNegative(),
				DDataStructure.strictPositive(),
			]),
			{
				identifier: "ConstrainedNumber",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"import * as DNumber from \"@duplojs/lang/number\";",
				"",
				"export type ConstrainedNumber = number & (DNumber.GreaterThan<-10> & DNumber.LessThan<10>) & (DNumber.GreaterThanOrEqual<-20> & DNumber.LessThanOrEqual<20>) & DNumber.Even & DNumber.GreaterThan<-5> & DNumber.GreaterThanOrEqual<-4> & DNumber.Integer & DNumber.LessThan<5> & DNumber.LessThanOrEqual<4> & DNumber.MultipleOf<2> & DNumber.Negative & DNumber.NotZero & DNumber.Odd & DNumber.Positive & DNumber.Safe & DNumber.StrictNegative & DNumber.StrictPositive;",
			].join("\n"),
		);
	});

	it("renders every array constraint", () => {
		const result = render(
			DDataStructure.array(
				DDataStructure.number(),
				[
					DDataStructure.arrayLengthEqual(2),
					DDataStructure.maxElements(3),
					DDataStructure.minElements(1),
				],
			),
			{
				identifier: "ConstrainedArray",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"import * as DArray from \"@duplojs/lang/array\";",
				"",
				"export type ConstrainedArray = readonly number[] & DArray.LengthEqual<2> & DArray.MaxElements<3> & DArray.MinElements<1>;",
			].join("\n"),
		);
	});

	it("renders composed array and union structures", () => {
		const result = render(
			DDataStructure.union([
				DDataStructure.string(),
				DDataStructure.array(DDataStructure.number()),
			]),
			{
				identifier: "Value",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe("export type Value = string | readonly number[];");
	});

	it("renders an object with readonly and optional properties", () => {
		const result = render(
			DDataStructure.object({
				id: DDataStructure.number(),
				"display-name": DDataStructure.string(),
				nickname: DDataStructure.optional(DDataStructure.string()),
			}),
			{
				identifier: "User",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"export type User = {",
				"    readonly id: number;",
				"    readonly \"display-name\": string;",
				"    readonly nickname?: undefined | string;",
				"};",
			].join("\n"),
		);
	});

	it("renders a readonly partial record", () => {
		const result = render(
			DDataStructure.record(
				DDataStructure.union([
					DDataStructure.literal("draft"),
					DDataStructure.literal("published"),
				]),
				DDataStructure.optional(DDataStructure.boolean()),
			),
			{
				identifier: "Flags",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			"export type Flags = Partial<Readonly<Record<\"draft\" | \"published\", undefined | boolean>>>;",
		);
	});

	it("renders an open record as partial", () => {
		const result = render(
			DDataStructure.record(
				DDataStructure.string(),
				DDataStructure.number(),
			),
			{
				identifier: "Dictionary",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			"export type Dictionary = Partial<Readonly<Record<string, number>>>;",
		);
	});

	it("renders every primitive type", () => {
		const result = render(
			DDataStructure.union([
				DDataStructure.bigint(),
				DDataStructure.literal(-42n),
				DDataStructure.boolean(),
				DDataStructure.literal(true),
				DDataStructure.date(),
				DDataStructure.null(),
				DDataStructure.literal(-42),
				DDataStructure.literal("value"),
				DDataStructure.time(),
				DDataStructure.undefined(),
			]),
			{
				identifier: "Primitive",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"import * as DChrono from \"@duplojs/lang/chrono\";",
				"",
				"export type Primitive = bigint | -42n | boolean | true | DChrono.TheDate | null | -42 | \"value\" | DChrono.TheTime | undefined;",
			].join("\n"),
		);
	});

	it("generates an alias for a nested recursive structure", () => {
		const recursiveStructure: DDataStructure.Structure = DDataStructure.union([
			DDataStructure.number(),
			DDataStructure.array(
				DDataStructure.lazy(() => recursiveStructure),
			),
		]);

		const result = render(
			DDataStructure.array(recursiveStructure),
			{
				identifier: "RecursiveValues",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		);

		expect(result).toBe(
			[
				"export type RecursiveType0 = number | readonly RecursiveType0[];",
				"",
				"export type RecursiveValues = readonly RecursiveType0[];",
			].join("\n"),
		);
	});

	it("preserves structure override metadata when rebuilding a structure", () => {
		const baseStructure = DDataStructure.string();
		const overriddenStructure = baseStructure
			.addIdentifier("ExternalString")
			.addOverrideTypescriptTransformer(
				Typescript.factory.createTypeReferenceNode("ExternalStringValue"),
			)
			.addMapImportContextEntries([
				"external-package",
				{ direct: ["ExternalStringValue"] },
			]);
		const rebuiltStructure = overriddenStructure
			.clone()
			.addConstraint(DDataStructure.notEmpty());

		expect(render(
			DDataStructure.array(rebuiltStructure),
			{
				identifier: "Values",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		)).toBe(
			[
				"import { ExternalStringValue } from \"external-package\";",
				"",
				"import * as DString from \"@duplojs/lang/string\";",
				"",
				"export type ExternalString = ExternalStringValue & DString.NotEmpty;",
				"",
				"export type Values = readonly ExternalString[];",
			].join("\n"),
		);
		expect(rebuiltStructure.definition.overrideTypescriptTransformer).toBeDefined();
	});

	it("allows an override to delegate to the standard transformer", () => {
		const structure = DDataStructure.string()
			.addOverrideTypescriptTransformer(
				(currentStructure, { transformer }) => transformer(currentStructure),
			);

		expect(render(
			structure,
			{
				identifier: "Value",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		)).toBe("export type Value = string;");
	});

	it("renders a new type with its dedicated constraints", () => {
		const score = DModeling.NewTypeStructure(
			"Score",
			DDataStructure.number([DDataStructure.positive()]),
			[
				DDataStructure.integer(),
				DDataStructure.safe(),
			],
		);

		expect(render(
			score,
			{
				identifier: "Score",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		)).toBe(
			[
				"import * as DNumber from \"@duplojs/lang/number\";",
				"",
				"import * as DModeling from \"@duplojs/lang/modeling\";",
				"",
				"export type Score = number & DNumber.Positive & DModeling.NewType<\"Score\", DNumber.Integer | DNumber.Safe>;",
			].join("\n"),
		);
	});

	it("renders an entity composed of new types", () => {
		const userName = DModeling.NewTypeStructure(
			"UserName",
			DDataStructure.string(),
			[DDataStructure.minCharacters(3)],
		);
		const userId = DModeling.NewTypeStructure(
			"UserId",
			DDataStructure.number(),
			[],
		);
		const user = DModeling.EntityStructure(
			"User",
			() => ({
				id: userId,
				name: userName,
			}),
		);

		expect(render(
			user,
			{
				identifier: "User",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		)).toBe(
			[
				"import * as DModeling from \"@duplojs/lang/modeling\";",
				"",
				"import * as DString from \"@duplojs/lang/string\";",
				"",
				"export type User = DModeling.Entity<\"User\"> & {",
				"    readonly id: number & DModeling.NewType<\"UserId\", never>;",
				"    readonly name: string & DModeling.NewType<\"UserName\", DString.MinCharacters<3>>;",
				"};",
			].join("\n"),
		);
	});

	/* it("allocates unique identifiers for root and nested declarations", () => {
		const name = DDataStructure.string().addIdentifier("User");

		expect(render(
			DDataStructure.object({ name }),
			{
				identifier: "User",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
			},
		)).toBe(
			[
				"export type User = {",
				"    readonly name: User2;",
				"};",
				"",
				"export type User2 = string;",
			].join("\n"),
		);
	}); */

	it("shares hook analysis and undefined detection", () => {
		const source = DDataStructure.string();
		const replacement = DDataStructure.optional(DDataStructure.string());
		let hookCallCount = 0;

		const result = render(
			DDataStructure.object({
				first: source,
				second: source,
			}),
			{
				identifier: "Hooked",
				structureTransformers: defaultStructureTransformers,
				typeTransformers: defaultTypeTransformers,
				constraintTransformers: defaultConstraintTransformers,
				hooks: [
					({ structure, output }) => {
						if (structure === source) {
							hookCallCount++;
							return output("stop", replacement);
						}

						return output("next", structure);
					},
				],
			},
		);

		expect(result).toBe(
			[
				"export type Hooked = {",
				"    readonly first?: undefined | string;",
				"    readonly second?: undefined | string;",
				"};",
			].join("\n"),
		);
		expect(hookCallCount).toBe(2);
	});
});
