import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("fail", () => {
	it("should create a fail left either", () => {
		const either = DEither.fail();

		expect(DEither.isLeft(either)).toBe(true);
		expect(DEither.failKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("fail");
		expect(DEither.valueKind.getValue(either)).toBeUndefined();

		type _CheckEither = DCommon.ExpectType<
			typeof either,
			DEither.Fail,
			"strict"
		>;
	});
});
