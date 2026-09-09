import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("betweenThan", () => {
	it("should validate a number strictly between bounds", () => {
		expect(DNumber.betweenThan(3, 2, 4)).toBe(true);
		expect(DNumber.betweenThan(2, 2, 4)).toBe(false);
		expect(DNumber.betweenThan(4, 2, 4)).toBe(false);
		expect(DNumber.betweenThan(5, 2, 4)).toBe(false);
	});

	it("should validate a number strictly between bounds with curry", () => {
		const predicate = DNumber.betweenThan(2, 4);

		expect(predicate(3)).toBe(true);
		expect(predicate(2)).toBe(false);
	});

	it("should distribute number unions before narrowing values between bounds", () => {
		const source = 4 as 2 | 4 | 6;

		if (DNumber.betweenThan(source, 3, 5)) {
			type _CheckSource = ExpectType<
				typeof source,
				4,
				"strict"
			>;
		}
	});

	it("should narrow compatible constraints", () => {
		const source = 3 as
			| (number & DNumber.LessThan<2>)
			| (number & DNumber.LessThan<4>)
			| (number & DNumber.GreaterThan<1>)
			| (number & DNumber.GreaterThan<4>)
			| (number & DNumber.GreaterThan<1> & DNumber.LessThan<5>)
			| (number & DNumber.GreaterThan<2> & DNumber.LessThan<4>);

		if (DNumber.betweenThan(source, 2, 4)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number & DNumber.LessThan<4> & DNumber.GreaterThan<2>)
				| (number & DNumber.GreaterThan<1> & DNumber.GreaterThan<2> & DNumber.LessThan<4>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<5> & DNumber.GreaterThan<2> & DNumber.LessThan<4>)
				| (number & DNumber.GreaterThan<2> & DNumber.LessThan<4>),
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.betweenThan(2, 4),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.GreaterThan<2> & DNumber.LessThan<4>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
