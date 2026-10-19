import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("startsWith", () => {
	it("composes prefix, suffix and inclusion constraints", () => {
		const structure = DDataStructure.string([
			DDataStructure.startsWith("duplo"),
			DDataStructure.endsWith(".ts"),
			DDataStructure.include("lang"),
		]);
		const result = DEither.unwrapByInformationOrThrow(
			structure.check("duplo-lang.ts"),
			"check-success",
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			& `duplo${string}`
			& `${string}.ts`
			& `${string}lang${string}`,
			"strict"
		>;

		expect(result).toBe("duplo-lang.ts");
		expect(structure.is("other-lang.ts")).toBe(false);
		expect(structure.is("duplo-lang.js")).toBe(false);
		expect(structure.is("duplo-tools.ts")).toBe(false);
	});

	it("creates a typed constraint", () => {
		const constraint = DDataStructure.startsWith("duplo");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.StartsWithConstraint<"duplo">,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual({ searchString: "duplo" });
		expect(constraint.executeCheck("duplojs")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("jsduplo")).toBe(DDataStructure.ErrorSymbol);
	});

	it("infers and validates a nested string structure", () => {
		const constraint = DDataStructure.startsWith("duplo");
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				name: DDataStructure.string([constraint]),
			}),
		});
		const input = { user: { name: "duplojs" } };
		const result = DEither.unwrapByInformationOrThrow(structure.check(input), "check-success");

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{ readonly user: { readonly name: `duplo${string}` } },
			"strict"
		>;
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly user: { readonly name: `duplo${string}` } },
			"strict"
		>;

		expect(result).toStrictEqual(input);
		const error = DEither.unwrapByInformationOrThrow(
			structure.check({ user: { name: "jsduplo" } }),
			"check-error",
		);
		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]).toMatchObject({
			data: "jsduplo",
			path: "user.name",
		});
		expect((error.issues[0] as DDataStructure.Issue).getSubSource?.()).toBe(constraint);
	});

	it("narrows unknown values only after successful validation", () => {
		const structure = DDataStructure.string([DDataStructure.startsWith("duplo")]);
		const input: unknown = "duplojs";

		if (structure.is(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				`duplo${string}`,
				"strict"
			>;

			expect(input).toBe("duplojs");
		} else {
			expect.unreachable();
		}

		expect(structure.is(42)).toBe(false);
		expect(structure.is("jsduplo")).toBe(false);
	});
});
