import { DEither, type ExpectType } from "@scripts";

describe("ok", () => {
	it("should create an ok right either", () => {
		const either = DEither.ok();

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.okKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("ok");
		expect(DEither.valueKind.getValue(either)).toBeUndefined();

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Ok,
			"strict"
		>;
	});
});
