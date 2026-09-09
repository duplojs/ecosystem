import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isOdd", () => {
	it("should validate an odd number", () => {
		expect(DNumber.isOdd(3)).toBe(true);
		expect(DNumber.isOdd(2)).toBe(false);
	});

	it("should narrow a number with an odd constraint", () => {
		const source = 3 as number;

		if (DNumber.isOdd(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.Odd,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying an odd constraint", () => {
		const source = 3 as 2 | 3;

		if (DNumber.isOdd(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				(2 | 3) & DNumber.Odd,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isOdd,
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.Odd,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
