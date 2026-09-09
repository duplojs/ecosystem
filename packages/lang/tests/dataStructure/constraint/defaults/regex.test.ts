import { DDataStructure, type DString, type ExpectType } from "@scripts";

describe("RegexConstraint", () => {
	it("creates a synchronous regex constraint", () => {
		const regex = /^contact@/;
		const constraint = DDataStructure.RegexConstraint(regex);

		type _CheckConstraint = ExpectType<
			typeof constraint,
			DDataStructure.RegexConstraint,
			"strict"
		>;
		type _CheckConstraintValue = ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			string,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
		expect(constraint.definition.regex).toBe(regex);
	});

	it("accepts values ​​that match the regex", () => {
		const constraint = DDataStructure.RegexConstraint(/^contact@/);

		expect(constraint.executeCheck("contact@mail.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid values ​​that not match the regex", () => {
		const constraint = DDataStructure.RegexConstraint(/^contact@/);

		expect(constraint.executeCheck("value-error")).toBe(DDataStructure.ErrorSymbol);
	});
});
