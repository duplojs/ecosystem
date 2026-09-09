import { DEither, type ExpectType } from "@scripts";

describe("right", () => {
	it("should create a right either with information and value", () => {
		const either = DEither.right("created", 42);

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("created");
		expect(DEither.valueKind.getValue(either)).toBe(42);

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Right<"created", 42>,
			"strict"
		>;
	});

	it("should default the value to undefined", () => {
		const either = DEither.right("empty");

		expect(DEither.unwrapRight(either)).toBeUndefined();

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Right<"empty", undefined>,
			"strict"
		>;
	});
});
