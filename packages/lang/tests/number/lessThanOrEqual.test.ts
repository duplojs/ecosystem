import { DNumber, pipe, when, type ExpectType } from "@scripts";

describe("lessThanOrEqual", () => {
	it("should validate a number less than or equal to the threshold", () => {
		expect(DNumber.lessThanOrEqual(2, 3)).toBe(true);
		expect(DNumber.lessThanOrEqual(3, 3)).toBe(true);
		expect(DNumber.lessThanOrEqual(4, 3)).toBe(false);
	});

	it("should validate a number less than or equal to the threshold with curry", () => {
		const predicate = DNumber.lessThanOrEqual(3);

		expect(predicate(3)).toBe(true);
		expect(predicate(4)).toBe(false);
	});

	it("should distribute number unions before narrowing values less than or equal to the threshold", () => {
		const source = 2 as 2 | 3;

		if (DNumber.lessThanOrEqual(source, 2)) {
			type _CheckSource = ExpectType<
				typeof source,
				2,
				"strict"
			>;
		}
	});

	it("should narrow compatible constraints", () => {
		const source = 2 as
			| (number & DNumber.LessThan<3>)
			| (number & DNumber.LessThan<5>)
			| (number & DNumber.LessThanOrEqual<3>)
			| (number & DNumber.GreaterThan<1>)
			| (number & DNumber.GreaterThan<3>)
			| (number & DNumber.GreaterThanOrEqual<1>)
			| (number & DNumber.GreaterThanOrEqual<3>);

		if (DNumber.lessThanOrEqual(source, 3)) {
			type _CheckSource = ExpectType<
				typeof source,
				| (number & DNumber.LessThan<3>)
				| (number & DNumber.LessThan<5> & DNumber.LessThanOrEqual<3>)
				| (number & DNumber.LessThanOrEqual<3>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThanOrEqual<3>)
				| (number & DNumber.GreaterThanOrEqual<1> & DNumber.LessThanOrEqual<3>)
				| (number & DNumber.GreaterThanOrEqual<3> & DNumber.LessThanOrEqual<3>),
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = pipe(
			3 as number,
			when(
				DNumber.lessThanOrEqual(3),
				(value) => {
					type _CheckValue = ExpectType<
						typeof value,
						number & DNumber.LessThanOrEqual<3>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(4);
	});
});
