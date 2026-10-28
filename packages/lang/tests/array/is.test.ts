import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";

describe("is", () => {
	it("should validate an array", () => {
		expect(DArray.is(["a"])).toBe(true);
		expect(DArray.is("a")).toBe(false);
	});

	it("should narrow an unknown value to an unknown array", () => {
		const source = ["a"] as unknown;

		if (DArray.is(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				readonly unknown[],
				"strict"
			>;
		} else {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				unknown,
				"strict"
			>;
		}
	});

	it("should discriminate array values from an union", () => {
		const source = ["a"] as string | readonly ["a"] | number[];

		if (DArray.is(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				readonly ["a"] | number[],
				"strict"
			>;
		} else {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
