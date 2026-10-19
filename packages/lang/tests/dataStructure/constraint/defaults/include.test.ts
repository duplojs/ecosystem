import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("IncludeConstraint", () => {
	it("preserves the search string in its definition and inferred value", () => {
		const constraint = DDataStructure.IncludeConstraint("duplo");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.IncludeConstraint<"duplo">,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			`${string}duplo${string}`,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual({ searchString: "duplo" });
		expect(constraint.isAsynchronous()).toBe(false);
		expect(DDataStructure.constraintKind.has(constraint)).toBe(true);
		expect(DDataStructure.includeConstraintKind.has(constraint)).toBe(true);
	});

	it.each([
		{
			input: "duplo",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "duplojs",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "jsduplo",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "jsduplojs",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "jsDuplojs",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "dup",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "",
			expected: DDataStructure.ErrorSymbol,
		},
	])("checks $input", ({ input, expected }) => {
		const constraint = DDataStructure.IncludeConstraint("duplo");

		expect(constraint.executeCheck(input)).toBe(expected);
	});

	it.each(["", "duplojs"])("accepts %j when the search string is empty", (input) => {
		const constraint = DDataStructure.IncludeConstraint("");

		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.executeCheck(input)).toBe(DDataStructure.SuccessSymbol);
	});

	it("matches special characters literally", () => {
		const constraint = DDataStructure.IncludeConstraint("a.*");

		expect(constraint.executeCheck("heada.*tail")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("headaZZtail")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can be identified as a built-in constraint", () => {
		const constraint: DDataStructure.Constraint = DDataStructure.IncludeConstraint("duplo");

		if (DDataStructure.constraintIdentifier(constraint, DDataStructure.includeConstraintKind)) {
			type _CheckConstraint = DCommon.ExpectType<
				typeof constraint,
				DDataStructure.IncludeConstraint,
				"strict"
			>;

			expect(constraint.definition.searchString).toBe("duplo");
		} else {
			expect.unreachable();
		}
	});
});
