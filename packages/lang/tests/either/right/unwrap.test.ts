import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapRight", () => {
	it("should unwrap right values and keep other inputs unchanged", () => {
		const right = DEither.success(42);
		const left = DEither.error("message");

		const unwrappedRight = DEither.unwrapRight(right);
		const unwrappedLeft = DEither.unwrapRight(left);
		const plain = DEither.unwrapRight("plain");

		expect(unwrappedRight).toBe(42);
		expect(unwrappedLeft).toBe(left);
		expect(plain).toBe("plain");

		type _CheckRight = ExpectType<
			typeof unwrappedRight,
			42,
			"strict"
		>;
		type _CheckLeft = ExpectType<
			typeof unwrappedLeft,
			DEither.Error<"message">,
			"strict"
		>;
		type _CheckPlain = ExpectType<
			typeof plain,
			"plain",
			"strict"
		>;
	});

	it("should unwrap right values in pipe", () => {
		const result = pipe(
			DEither.right("value", "data"),
			DEither.unwrapRight,
		);

		expect(result).toBe("data");

		type _CheckResult = ExpectType<
			typeof result,
			"data",
			"strict"
		>;
	});
});
