import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";

describe("isSafe", () => {
	it("should validate a finite number inside safe bounds", () => {
		expect(DNumber.isSafe(1)).toBe(true);
		expect(DNumber.isSafe(1.5)).toBe(true);
		expect(DNumber.isSafe(Number.MAX_SAFE_INTEGER - 1)).toBe(true);
		expect(DNumber.isSafe(Number.MAX_SAFE_INTEGER)).toBe(false);
		expect(DNumber.isSafe(Number.MIN_SAFE_INTEGER)).toBe(false);
		expect(DNumber.isSafe(Number.POSITIVE_INFINITY)).toBe(false);
		expect(DNumber.isSafe(Number.NaN)).toBe(false);
	});

	it("should narrow a number with a safe constraint", () => {
		const source = 1 as number;

		if (DNumber.isSafe(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				number & DNumber.Safe,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying a safe constraint", () => {
		const source = 1 as 1 | 9007199254740992;

		if (DNumber.isSafe(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				(1 | 9007199254740992) & DNumber.Safe,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = DCommon.pipe(
			1 as number,
			DCommon.when(
				DNumber.isSafe,
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						number & DNumber.Safe,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
