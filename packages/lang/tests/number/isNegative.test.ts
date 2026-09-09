import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isNegative", () => {
	it("should validate a negative number including zero", () => {
		expect(DNumber.isNegative(-1)).toBe(true);
		expect(DNumber.isNegative(0)).toBe(true);
		expect(DNumber.isNegative(1)).toBe(false);
	});

	it("should narrow a number with a negative constraint", () => {
		const source = -1 as number;

		if (DNumber.isNegative(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.Negative,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying a negative constraint", () => {
		const source = -1 as -1 | 1;

		if (DNumber.isNegative(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				(-1 | 1) & DNumber.Negative,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			-1 as number,
			when(
				DNumber.isNegative,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.Negative,
						"strict"
					>;

					return value - 1;
				},
			),
		);

		expect(result).toBe(-2);
	});
});
