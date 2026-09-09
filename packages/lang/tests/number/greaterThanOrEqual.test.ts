import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("greaterThanOrEqual", () => {
	it("should validate a number greater than or equal to the threshold", () => {
		expect(DNumber.greaterThanOrEqual(4, 3)).toBe(true);
		expect(DNumber.greaterThanOrEqual(3, 3)).toBe(true);
		expect(DNumber.greaterThanOrEqual(2, 3)).toBe(false);
	});

	it("should validate a number greater than or equal to the threshold with curry", () => {
		const predicate = DNumber.greaterThanOrEqual(3);

		expect(predicate(3)).toBe(true);
		expect(predicate(2)).toBe(false);
	});

	it("should distribute number unions before narrowing values greater than or equal to the threshold", () => {
		const source = 3 as 2 | 3;

		if (DNumber.greaterThanOrEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				3,
				"strict"
			>;
		}
	});

	it("should narrow compatible constraints", () => {
		const source = 4 as
			| (number & DNumber.LessThan<3>)
			| (number & DNumber.LessThan<5>)
			| (number & DNumber.LessThanOrEqual<3>)
			| (number & DNumber.LessThanOrEqual<5>)
			| (number & DNumber.GreaterThan<2>)
			| (number & DNumber.GreaterThan<4>)
			| (number & DNumber.GreaterThanOrEqual<3>);

		if (DNumber.greaterThanOrEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number & DNumber.LessThan<5> & DNumber.GreaterThanOrEqual<3>)
				| (number & DNumber.LessThanOrEqual<3> & DNumber.GreaterThanOrEqual<3>)
				| (number & DNumber.LessThanOrEqual<5> & DNumber.GreaterThanOrEqual<3>)
				| (number & DNumber.GreaterThan<2> & DNumber.GreaterThanOrEqual<3>)
				| (number & DNumber.GreaterThan<4>)
				| (number & DNumber.GreaterThanOrEqual<3>),
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.greaterThanOrEqual(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.GreaterThanOrEqual<3>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
