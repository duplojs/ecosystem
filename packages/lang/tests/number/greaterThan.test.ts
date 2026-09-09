import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("greaterThan", () => {
	it("should validate a number greater than the threshold", () => {
		expect(DNumber.greaterThan(4, 3)).toBe(true);
		expect(DNumber.greaterThan(3, 3)).toBe(false);
		expect(DNumber.greaterThan(2, 3)).toBe(false);
	});

	it("should validate a number greater than the threshold with curry", () => {
		const predicate = DNumber.greaterThan(3);

		expect(predicate(4)).toBe(true);
		expect(predicate(3)).toBe(false);
	});

	it("should distribute number unions before narrowing values greater than the threshold", () => {
		const source = 4 as 2 | 4;

		if (DNumber.greaterThan(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				4,
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

		if (DNumber.greaterThan(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number & DNumber.LessThan<5> & DNumber.GreaterThan<3>)
				| (number & DNumber.LessThanOrEqual<5> & DNumber.GreaterThan<3>)
				| (number & DNumber.GreaterThan<2> & DNumber.GreaterThan<3>)
				| (number & DNumber.GreaterThan<4>)
				| (number & DNumber.GreaterThanOrEqual<3> & DNumber.GreaterThan<3>),
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			4 as number,
			when(
				DNumber.greaterThan(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.GreaterThan<3>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(5);
	});
});
