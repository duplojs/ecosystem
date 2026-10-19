import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";

describe("endsWith", () => {
	it("creates a typed constraint", () => {
		const constraint = DDataStructure.endsWith("duplo");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.EndsWithConstraint<"duplo">,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual({ searchString: "duplo" });
		expect(constraint.executeCheck("jsduplo")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("duplojs")).toBe(DDataStructure.ErrorSymbol);
	});

	it("infers and validates a nested string structure", () => {
		const constraint = DDataStructure.endsWith("duplo");
		const structure = DDataStructure.object({
			user: DDataStructure.object({
				name: DDataStructure.string([constraint]),
			}),
		});
		const input = { user: { name: "jsduplo" } };
		const result = DEither.unwrapByInformationOrThrow(structure.check(input), "check-success");

		type _CheckStructureValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			{ readonly user: { readonly name: `${string}duplo` } },
			"strict"
		>;
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			{ readonly user: { readonly name: `${string}duplo` } },
			"strict"
		>;

		expect(result).toStrictEqual(input);
		const error = DEither.unwrapByInformationOrThrow(
			structure.check({ user: { name: "duplojs" } }),
			"check-error",
		);
		expect(error.issues).toHaveLength(1);
		expect(error.issues[0]).toMatchObject({
			data: "duplojs",
			path: "user.name",
		});
		expect((error.issues[0] as DDataStructure.Issue).getSubSource?.()).toBe(constraint);
	});

	it("narrows unknown values only after successful validation", () => {
		const structure = DDataStructure.string([DDataStructure.endsWith("duplo")]);
		const input: unknown = "jsduplo";

		if (structure.is(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				`${string}duplo`,
				"strict"
			>;

			expect(input).toBe("jsduplo");
		} else {
			expect.unreachable();
		}

		expect(structure.is(42)).toBe(false);
		expect(structure.is("duplojs")).toBe(false);
	});
});
