import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("some", () => {
	it("should create a some right either", () => {
		const value = { value: 42 };
		const either = DEither.some(value);

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.someKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("some");
		expect(DEither.valueKind.getValue(either)).toBe(value);

		type _CheckEither = DCommon.ExpectType<
			typeof either,
			DEither.Some<{ value: number }>,
			"strict"
		>;
	});
});
