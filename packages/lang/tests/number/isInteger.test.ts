import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("isInteger", () => {
	it("should validate an integer", () => {
		expect(DNumber.isInteger(3)).toBe(true);
		expect(DNumber.isInteger(3.1)).toBe(false);
	});

	it("should narrow a number with an integer constraint", () => {
		const source = 3 as number;

		if (DNumber.isInteger(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				number & DNumber.Integer,
				"strict"
			>;
		}
	});

	it("should preserve number unions when applying an integer constraint", () => {
		const source = 3 as 3 | 3.1;

		if (DNumber.isInteger(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				(3 | 3.1) & DNumber.Integer,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.isInteger,
				(value) => {
					type _CheckValue = ExpectType<
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
