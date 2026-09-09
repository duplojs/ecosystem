import { DEither, pipe, type ExpectType } from "@scripts";

describe("unwrapLeft", () => {
	it("should unwrap left values and keep other inputs unchanged", () => {
		const left = DEither.error("message");
		const right = DEither.success(42);

		const unwrappedLeft = DEither.unwrapLeft(left);
		const unwrappedRight = DEither.unwrapLeft(right);
		const plain = DEither.unwrapLeft("plain");

		expect(unwrappedLeft).toBe("message");
		expect(unwrappedRight).toBe(right);
		expect(plain).toBe("plain");

		type _CheckLeft = ExpectType<
			typeof unwrappedLeft,
			"message",
			"strict"
		>;
		type _CheckRight = ExpectType<
			typeof unwrappedRight,
			DEither.Success<42>,
			"strict"
		>;
		type _CheckPlain = ExpectType<
			typeof plain,
			"plain",
			"strict"
		>;
	});

	it("should unwrap left values in pipe", () => {
		const result = pipe(
			DEither.left("value", "data"),
			DEither.unwrapLeft,
		);

		expect(result).toBe("data");

		type _CheckResult = ExpectType<
			typeof result,
			"data",
			"strict"
		>;
	});
});
