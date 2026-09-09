import { DEither, type ExpectType } from "@scripts";

describe("success", () => {
	it("should create a success right either", () => {
		const either = DEither.success({ value: 42 });

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.successKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("success");
		expect(DEither.valueKind.getValue(either)).toStrictEqual({ value: 42 });

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Success<{ readonly value: 42 }>,
			"strict"
		>;
	});
});
