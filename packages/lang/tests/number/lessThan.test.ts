import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";

describe("lessThan", () => {
	it("should validate a number less than the threshold", () => {
		expect(DNumber.lessThan(2, 3)).toBe(true);
		expect(DNumber.lessThan(3, 3)).toBe(false);
		expect(DNumber.lessThan(4, 3)).toBe(false);
	});

	it("should validate a number less than the threshold with curry", () => {
		const predicate = DNumber.lessThan(3);

		expect(predicate(2)).toBe(true);
		expect(predicate(3)).toBe(false);
	});

	it("should distribute number unions before narrowing values less than the threshold", () => {
		const source = 2 as 2 | 4;

		if (DNumber.lessThan(source, 3)) {
			type _CheckSource = DCommon.ExpectType<
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

		if (DNumber.lessThan(source, 3)) {
			type _CheckSource = DCommon.ExpectType<
				typeof source,
				| (number & DNumber.LessThan<3>)
				| (number & DNumber.LessThan<5> & DNumber.LessThan<3>)
				| (number & DNumber.LessThanOrEqual<3> & DNumber.LessThan<3>)
				| (number & DNumber.GreaterThan<1> & DNumber.LessThan<3>)
				| (number & DNumber.GreaterThanOrEqual<1> & DNumber.LessThan<3>),
				"strict"
			>;
		}
	});

	it("should narrow a number inside a pipe when callback", () => {
		const result = DCommon.pipe(
			2 as number,
			DCommon.when(
				DNumber.lessThan(3),
				(value) => {
					type _CheckValue = DCommon.ExpectType<
						typeof value,
						number & DNumber.LessThan<3>,
						"strict"
					>;

					return value + 1;
				},
			),
		);

		expect(result).toBe(3);
	});
});
