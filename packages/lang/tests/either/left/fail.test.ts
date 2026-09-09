import { DEither, type ExpectType } from "@scripts";

describe("fail", () => {
	it("should create a fail left either", () => {
		const either = DEither.fail();

		expect(DEither.isLeft(either)).toBe(true);
		expect(DEither.failKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("fail");
		expect(DEither.valueKind.getValue(either)).toBeUndefined();

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Fail,
			"strict"
		>;
	});
});
