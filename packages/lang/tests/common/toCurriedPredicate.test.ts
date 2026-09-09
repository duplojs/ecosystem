import { DCommon, type ExpectType, pipe, when } from "@scripts";

describe("toCurriedPredicate", () => {
	it("returns a predicate preserving narrowing", () => {
		const isString = DCommon.toCurriedPredicate(
			(input: string | number): input is string => typeof input === "string",
		);
		const input = "value" as string | number;

		if (isString(input)) {
			type _CheckInput = ExpectType<
				typeof input,
				string,
				"strict"
			>;

			expect(input.toUpperCase()).toBe("VALUE");
		} else {
			type _CheckInput = ExpectType<
				typeof input,
				number,
				"strict"
			>;
		}
	});

	it("works as a predicate in a pipe", () => {
		const isString = DCommon.toCurriedPredicate(
			(input: string | number): input is string => typeof input === "string",
		);
		const result = pipe(
			"value" as string | number,
			when(
				isString,
				(input) => input.length,
			),
		);

		type _CheckResult = ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(5);
	});
});
