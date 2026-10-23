import type * as DCommon from "@scripts/common";
import * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";

describe("UrlConstraint", () => {
	it("creates a synchronous url constraint", () => {
		const constraint = DDataStructure.UrlConstraint();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DDataStructure.UrlConstraint,
			"strict"
		>;
		type _CheckConstraintValue = DCommon.ExpectType<
			DDataStructure.ConstraintValue<typeof constraint>,
			DString.Url,
			"strict"
		>;

		expect(constraint.isAsynchronous()).toBe(false);
	});

	it("accepts valid url values", () => {
		const constraint = DDataStructure.UrlConstraint();

		expect(constraint.executeCheck("https://example.com")).toBe(
			DDataStructure.SuccessSymbol,
		);
	});

	it("rejects invalid url values without an error handler", () => {
		const constraint = DDataStructure.UrlConstraint();

		expect(constraint.executeCheck("not-a-url")).toBe(DDataStructure.ErrorSymbol);
	});
});
