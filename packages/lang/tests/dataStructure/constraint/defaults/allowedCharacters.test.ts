import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("AllowedCharactersConstraint", () => {
	it("creates a synchronous allowed characters constraint", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint(["a-z", "0-9"]);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.AllowedCharactersConstraint<"a-z" | "0-9">,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.AllowedCharacters<"a-z" | "0-9">,
			"strict"
		>;

		expect(constraint.definition).toEqual({ charactersRange: ["a-z", "0-9"] });
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts strings composed of allowed characters", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint(["a-z", "0-9"]);

		expect(constraint.executeCheck("abc123")).toBe(DDataStructure.SuccessSymbol);
		expect(constraint.executeCheck("")).toBe(DDataStructure.SuccessSymbol);
	});

	it("rejects strings containing forbidden characters without an error handler", () => {
		const constraint = DDataStructure.AllowedCharactersConstraint("a-z");

		expect(constraint.executeCheck("ABC")).toBe(DDataStructure.ErrorSymbol);
	});
});
