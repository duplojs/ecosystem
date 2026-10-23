import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";

describe("isEven", () => {
	it("should validate an even number", () => {
		expect(DNumber.isEven(2)).toBe(true);
		expect(DNumber.isEven(3)).toBe(false);
	});

	it("should narrow a number with an even constraint", () => {
		const source = 2 as number;

		if (DNumber.isEven(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				number & DNumber.Even,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying an even constraint", () => {
		const source = 2 as 2 | 3;

		if (DNumber.isEven(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				(2 | 3) & DNumber.Even,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = DCommon.pipe(
			2 as number,
			DCommon.when(
				DNumber.isEven,
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						number & DNumber.Even,
						"strict"
					>;

					return value / 2;
				},
			),
		);

		expect(result).toBe(1);
	});
});
