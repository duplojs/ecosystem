import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isPositive", () => {
	it("should validate a positive number including zero", () => {
		expect(DNumber.isPositive(1)).toBe(true);
		expect(DNumber.isPositive(0)).toBe(true);
		expect(DNumber.isPositive(-1)).toBe(false);
	});

	it("should narrow a number with a positive constraint", () => {
		const source = 1 as number;

		if (DNumber.isPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.Positive,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying a positive constraint", () => {
		const source = 1 as -1 | 1;

		if (DNumber.isPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				(-1 | 1) & DNumber.Positive,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			1 as number,
			when(
				DNumber.isPositive,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.Positive,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
