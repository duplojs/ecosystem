
import * as DCommon from "@scripts/common";

describe("toCurriedPredicate", () => {
	it("returns a predicate preserving narrowing", () => {
		const isString = DCommon.toCurriedPredicate(
			(input: string | number): input is string => typeof input === "string",
		);
		const input = "value" as string | number;

		if (isString(input)) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				string,
				"strict"
			>;

			expect(input.toUpperCase()).toBe("VALUE");
		} else {
			type _CheckInput = DCommon.ExpectType<
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
		const result = DCommon.pipe(
			"value" as string | number,
			DCommon.when(
				isString,
				(input) => input.length,
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(5);
	});
});
