import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";

describe("EndsWithConstraint", () => {
	it("preserves the search string in its definition and inferred value", () => {
		const constraint = DDataStructure.EndsWithConstraint("duplo");

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.EndsWithConstraint<"duplo">,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			`${string}duplo`,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual({ searchString: "duplo" });
		expect(constraint.isAsynchronous()).toBe(false);
		expect(DDataStructure.constraintKind.has(constraint)).toBe(true);
		expect(DDataStructure.endsWithConstraintKind.has(constraint)).toBe(true);
	});

	it.each([
		{
			input: "duplo",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "jsduplo",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			input: "duplojs",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "xduplox",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "jsDuplo",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "plo",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			input: "",
			expected: DDataStructure.ErrorSymbol,
		},
	])("checks $input", ({ input, expected }) => {
		const constraint = DDataStructure.EndsWithConstraint("duplo");

		expect(constraint.executeCheck(input)).toBe(expected);
	});

	it.each(["", "duplojs"])("accepts %j when the search string is empty", (input) => {
		const constraint = DDataStructure.EndsWithConstraint("");

		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.executeCheck(input)).toBe(DDataStructure.SuccessSymbol);
	});

	it("matches special characters literally", () => {
		const constraint = DDataStructure.EndsWithConstraint("a.*");

		expect(constraint.executeCheck("heada.*")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("headaZZ")).toBe(DDataStructure.ErrorSymbol);
	});

	it("can be identified as a built-in constraint", () => {
		const constraint: DDataStructure.Constraint = DDataStructure.EndsWithConstraint("duplo");

		if (DDataStructure.constraintIdentifier(constraint, DDataStructure.endsWithConstraintKind)) {
			type _CheckConstraint = DCommon.ExpectType<
				typeof constraint,
				DDataStructure.EndsWithConstraint,
				"strict"
			>;

			expect(constraint.definition.searchString).toBe("duplo");
		} else {
			expect.unreachable();
		}
	});
});
