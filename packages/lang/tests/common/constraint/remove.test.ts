import { DCommon, type DNumber, type DString, type ExpectType } from "@scripts";

describe("removeConstraint", () => {
	it("returns the same value at runtime", () => {
		const value = { id: 1 } as const;
		const result = DCommon.removeConstraint(value);

		expect(result).toBe(value);

		type _CheckResult = ExpectType<
			typeof result,
			{ readonly id: 1 },
			"strict"
		>;
	});

	it("removes string constraints from the returned type", () => {
		const value = "hello" as string & DString.NotEmpty & DString.MaxCharacters<12>;
		const result = DCommon.removeConstraint(value);

		expect(result.toUpperCase()).toBe("HELLO");

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		// @ts-expect-error result does not keep the string constraint.
		const constrained: string & DString.NotEmpty = result;
		void constrained;
	});

	it("removes an allowed characters constraint with a callable payload", () => {
		const value = "hello" as string & DString.AllowedCharacters<"a-z">;
		const result = DCommon.removeConstraint(value);

		type _CheckResult = ExpectType<
			typeof result,
			string,
			"strict"
		>;

		// @ts-expect-error result does not keep the AllowedCharacters constraint.
		const constrained: string & DString.AllowedCharacters<"a-z"> = result;
		void constrained;
	});

	it("removes number constraints from the returned type", () => {
		const value = 42 as number & DNumber.Positive & DNumber.GreaterThan<10>;
		const result = DCommon.removeConstraint(value);

		expect(result + 1).toBe(43);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		// @ts-expect-error result does not keep the number constraint.
		const constrained: number & DNumber.Positive = result;
		void constrained;
	});

	it("distributes constraint removal over primitive unions", () => {
		const value = "hello" as (string & DString.NotEmpty) | (number & DNumber.Positive);

		const result = DCommon.removeConstraint(value);

		expect(["hello", 42]).toContain(result);

		type _CheckResult = ExpectType<
			typeof result,
			string | number,
			"strict"
		>;
	});
});
