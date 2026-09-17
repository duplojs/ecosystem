import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("none", () => {
	it("should create a none left either", () => {
		const either = DEither.none();

		expect(DEither.isLeft(either)).toBe(true);
		expect(DEither.noneKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("none");
		expect(DEither.valueKind.getValue(either)).toBeNull();

		type _CheckEither = DCommon.ExpectType<
			typeof either,
			DEither.None,
			"strict"
		>;
	});
});
