import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";

describe("isNotZero", () => {
	it("should validate a non-zero number", () => {
		expect(DNumber.isNotZero(1)).toBe(true);
		expect(DNumber.isNotZero(-1)).toBe(true);
		expect(DNumber.isNotZero(0)).toBe(false);
	});

	it("should narrow a number with a not-zero constraint", () => {
		const source = 1 as number;

		if (DNumber.isNotZero(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				number & DNumber.NotZero,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying a not-zero constraint", () => {
		const source = 1 as 0 | 1;

		if (DNumber.isNotZero(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				(0 | 1) & DNumber.NotZero,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = DCommon.pipe(
			1 as number,
			DCommon.when(
				DNumber.isNotZero,
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						number & DNumber.NotZero,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
