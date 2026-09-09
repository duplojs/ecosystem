import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isStrictPositive", () => {
	it("should validate a strictly positive number", () => {
		expect(DNumber.isStrictPositive(1)).toBe(true);
		expect(DNumber.isStrictPositive(0)).toBe(false);
		expect(DNumber.isStrictPositive(-1)).toBe(false);
	});

	it("should narrow a number with a strict positive constraint", () => {
		const source = 1 as number;

		if (DNumber.isStrictPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.StrictPositive,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying a strict positive constraint", () => {
		const source = 1 as -1 | 1;

		if (DNumber.isStrictPositive(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				(-1 | 1) & DNumber.StrictPositive,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			1 as number,
			when(
				DNumber.isStrictPositive,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.StrictPositive,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(2);
	});
});
