import { DEither, type ExpectType } from "@scripts";

describe("error", () => {
	it("should create an error left either", () => {
		const either = DEither.error("message");

		expect(DEither.isLeft(either)).toBe(true);
		expect(DEither.errorKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("error");
		expect(DEither.valueKind.getValue(either)).toBe("message");

		type _CheckEither = ExpectType<
			typeof either,
			DEither.Error<"message">,
			"strict"
		>;
	});
});
