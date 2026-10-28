import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";

describe("isInteger", () => {
	it("should validate an integer", () => {
		expect(DNumber.isInteger(3)).toBe(true);
		expect(DNumber.isInteger(3.1)).toBe(false);
	});

	it("should narrow a number with an integer constraint", () => {
		const source = 3 as number;

		if (DNumber.isInteger(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				number & DNumber.Integer,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying an integer constraint", () => {
		const source = 3 as 3 | 3.1;

		if (DNumber.isInteger(source)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				(3 | 3.1) & DNumber.Integer,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = DCommon.pipe(
			3 as number,
			DCommon.when(
				DNumber.isInteger,
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						number & DNumber.Integer,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
