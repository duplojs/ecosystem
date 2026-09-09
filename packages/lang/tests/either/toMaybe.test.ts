import { DEither, type ExpectType } from "@scripts";

describe("toMaybe", () => {
	it("should preserve right and left values", () => {
		const right = DEither.success(42);
		const left = DEither.error("message");

		const rightResult = DEither.toMaybe(right);
		const leftResult = DEither.toMaybe(left);

		expect(rightResult).toBe(right);
		expect(leftResult).toBe(left);

		type _CheckRightResult = ExpectType<
			typeof rightResult,
			DEither.Success<42>,
			"strict"
		>;
		type _CheckLeftResult = ExpectType<
			typeof leftResult,
			DEither.Error<"message">,
			"strict"
		>;
	});

	it("should convert null and undefined to none", () => {
		const nullResult = DEither.toMaybe(null);
		const undefinedResult = DEither.toMaybe(undefined);

		expect(nullResult).toStrictEqual(DEither.none());
		expect(undefinedResult).toStrictEqual(DEither.none());

		type _CheckNullResult = ExpectType<
			typeof nullResult,
			DEither.None,
			"strict"
		>;
		type _CheckUndefinedResult = ExpectType<
			typeof undefinedResult,
			DEither.None,
			"strict"
		>;
	});

	it("should convert other values to some without cloning them", () => {
		const input = { id: 1 };
		const result = DEither.toMaybe(input);

		expect(result).toStrictEqual(DEither.some(input));
		expect(DEither.unwrapRight(result)).toBe(input);

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Some<{ id: number }>,
			"strict"
		>;
	});

	it("should distribute the result over input unions", () => {
		const input = Math.random() > -1 ? "value" : null;
		const result = DEither.toMaybe(input);

		expect(result).toStrictEqual(DEither.some("value"));

		type _CheckResult = ExpectType<
			typeof result,
			DEither.Some<string> | DEither.None,
			"strict"
		>;
	});
});
