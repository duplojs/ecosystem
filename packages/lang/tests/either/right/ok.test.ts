import type * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

describe("ok", () => {
	it("should create an ok right either", () => {
		const either = DEither.ok();

		expect(DEither.isRight(either)).toBe(true);
		expect(DEither.okKind.has(either)).toBe(true);
		expect(DEither.informationKind.getValue(either)).toBe("ok");
		expect(DEither.valueKind.getValue(either)).toBeUndefined();

		type _CheckEither = DCommon.ExpectType<
			typeof either,
			DEither.Ok,
			"strict"
		>;
	});
});
