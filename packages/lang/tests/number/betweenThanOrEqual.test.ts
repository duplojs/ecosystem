import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("betweenThanOrEqual", () => {
	it("should validate a number between bounds inclusively", () => {
		expect(DNumber.betweenThanOrEqual(3, 2, 4)).toBe(true);
		expect(DNumber.betweenThanOrEqual(2, 2, 4)).toBe(true);
		expect(DNumber.betweenThanOrEqual(4, 2, 4)).toBe(true);
		expect(DNumber.betweenThanOrEqual(5, 2, 4)).toBe(false);
	});

	it("should validate a number between bounds inclusively with curry", () => {
		const predicate = DNumber.betweenThanOrEqual(2, 4);

		expect(predicate(2)).toBe(true);
		expect(predicate(5)).toBe(false);
	});

	it("should distribute number unions before narrowing values between or equal bounds", () => {
		const source = 4 as 2 | 4 | 6;

		if (DNumber.betweenThanOrEqual(source, 4, 6)) {
			type _CheckSource = ExpectType<
				typeof source,
				4 | 6,
				"strict"
			>;
		}
	});

	it("should narrow compatible constraints", () => {
		type ExpectedNarrowedSource =
			| (number & DNumber.LessThan<4> & DNumber.GreaterThanOrEqual<2>)
			| (number & DNumber.GreaterThan<1> & DNumber.GreaterThanOrEqual<2> & DNumber.LessThanOrEqual<4>)
			| (
				number
				& DNumber.GreaterThan<1>
				& DNumber.LessThan<5>
				& DNumber.GreaterThanOrEqual<2>
				& DNumber.LessThanOrEqual<4>
			)
			| (number & DNumber.GreaterThanOrEqual<2> & DNumber.LessThanOrEqual<4>);

		const source = 3 as
			| (number & DNumber.LessThan<2>)
			| (number & DNumber.LessThan<4>)
			| (number & DNumber.GreaterThan<1>)
			| (number & DNumber.GreaterThanOrEqual<5>)
			| (number & DNumber.GreaterThan<1> & DNumber.LessThan<5>)
			| (number & DNumber.GreaterThanOrEqual<2> & DNumber.LessThanOrEqual<4>);

		if (DNumber.betweenThanOrEqual(source, 2, 4)) {
			type _CheckSource = ExpectType<
				typeof source,
				ExpectedNarrowedSource,
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.betweenThanOrEqual(2, 4),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.GreaterThanOrEqual<2> & DNumber.LessThanOrEqual<4>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
