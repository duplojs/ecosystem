import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

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

		type _CheckLeft = DCommon.ExpectType<
			typeof unwrappedLeft,
			"message",
			"strict"
		>;
		type _CheckRight = DCommon.ExpectType<
			typeof unwrappedRight,
			DEither.Success<42>,
			"strict"
		>;
		type _CheckPlain = DCommon.ExpectType<
			typeof plain,
			"plain",
			"strict"
		>;
	});

	it("should unwrap left values in pipe", () => {
		const result = DCommon.pipe(
			DEither.left("value", "data"),
			DEither.unwrapLeft,
		);

		expect(result).toBe("data");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			"data",
			"strict"
		>;
	});
});
