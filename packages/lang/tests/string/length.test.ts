import type * as DCommon from "@scripts/common";
import * as DString from "@scripts/string";
import type * as DNumber from "@scripts/number";

describe("length", () => {
	it("should return string length", () => {
		const result = DString.length("hello");

		expect(result).toBe(5);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number & DNumber.Positive,
			"strict"
		>;
	});

	it("should return zero for an empty string", () => {
		expect(DString.length("")).toBe(0);
	});
});
