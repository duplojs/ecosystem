import { DEither, type ExpectType } from "@scripts";

describe("left", () => {
	it("should create a left either with information and value", () => {
		const either = DEither.left("created", 42);

		expect(DEither.isLeft(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("created");
		expect(DEither.valueKind.getValue(either)).toBe(42);

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Left<"created", 42>,
			"strict"
		>;
	});

	it("should default the value to undefined", () => {
		const either = DEither.left("empty");

		expect(DEither.unwrapLeft(either)).toBeUndefined();

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Left<"empty", undefined>,
			"strict"
		>;
	});
});
