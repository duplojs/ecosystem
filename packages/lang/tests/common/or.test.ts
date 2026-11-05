import * as DNumber from "@scripts/number";
import * as DCommon from "@scripts/common";

describe("or", () => {
	it("returns true when at least one predicate accepts the input", () => {
		const predicates = [
			(input: number) => input < 0,
			(input: number) => input % 2 === 0,
		] satisfies [
			(input: number) => boolean,
			(input: number) => boolean,
		];

		expect(DCommon.or(2, predicates)).toBe(true);
		expect(DCommon.or(-3, predicates)).toBe(true);
		expect(DCommon.or(3, predicates)).toBe(false);
	});

	it("supports curried predicates in a pipe", () => {
		const result = DCommon.pipe(
			2,
			DCommon.when(
				DCommon.or([
					(input: number) => input < 0,
					(input: number) => input % 2 === 0,
				]),
				(input) => input + 1,
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number,
			"strict"
		>;

		expect(result).toBe(3);
	});

	it("narrows to one accepted predicate output", () => {
		const input = "value" as string | number | null;
		const result = DCommon.or(input, [
			(value): value is string => typeof value === "string",
			(value): value is number => typeof value === "number",
		]);

		if (result) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				string | number,
				"strict"
			>;

			expect(input).toBe("value");
		} else {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				null,
				"strict"
			>;
		}
	});

	it.each([
		{
			input: 2,
			expected: true,
			transformed: "matched",
		},
		{
			input: -2,
			expected: true,
			transformed: "matched",
		},
		{
			input: 3,
			expected: true,
			transformed: "matched",
		},
		{
			input: -3,
			expected: false,
			transformed: -3,
		},
	])("returns boolean when number constraints are not union members for $input", ({ input, expected, transformed }) => {
		const direct = DCommon.or(input, [DNumber.isPositive, DNumber.isEven]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([DNumber.isPositive, DNumber.isEven]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "matched" as const;
			}),
		);

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);

		type CheckResult = DCommon.ExpectType<typeof curried, number | "matched", "strict">;
	});

	it.each([
		{
			input: 2 as number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: null as number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: -3 as number | null,
			expected: false,
			transformed: -3,
		},
	])("returns boolean when only part of the predicate union is retained for $input", ({ input, expected, transformed }) => {
		const isPositive = (value: number | null): value is number & DNumber.Positive => DCommon.isType(value, "number") && DNumber.isPositive(value);
		const isNull = DCommon.isType("null");
		const direct = DCommon.or(input, [isPositive, isNull]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, number | null, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number | null, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isPositive, isNull]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number | null, "strict">;

				return "matched" as const;
			}),
		);

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);

		type CheckResult = DCommon.ExpectType<typeof curried, number | null | "matched", "strict">;
	});

	it("preserves guards for constraints that are exact input union members", () => {
		type Input = (number & DNumber.Positive) | (number & DNumber.Even) | null;
		const input = 2 as Input;
		const isPositive = (value: Input): value is number & DNumber.Positive => DCommon.isType(value, "number") && DNumber.isPositive(value);
		const isEven = (value: Input): value is number & DNumber.Even => DCommon.isType(value, "number") && DNumber.isEven(value);
		const predicates = [isPositive, isEven] as const;

		if (DCommon.or(input, predicates)) {
			type CheckInput = DCommon.ExpectType<typeof input, (number & DNumber.Positive) | (number & DNumber.Even), "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, null, "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isPositive, isEven]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, (number & DNumber.Positive) | (number & DNumber.Even), "strict">;

				return "matched" as const;
			}),
		);

		expect(result).toBe("matched");
		expect(DCommon.or(null as Input, predicates)).toBe(false);

		type CheckResult = DCommon.ExpectType<typeof result, null | "matched", "strict">;
	});

	it("preserves literal union discrimination", () => {
		type Input = "a" | "b" | "c";
		const input = "b" as Input;
		const isA = (value: Input): value is "a" => DCommon.equal(value, "a");
		const isB = (value: Input): value is "b" => DCommon.equal(value, "b");

		if (DCommon.or(input, [isA, isB])) {
			type CheckInput = DCommon.ExpectType<typeof input, "a" | "b", "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, "c", "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isA, isB]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "a" | "b", "strict">;

				return 0 as const;
			}),
		);

		expect(result).toBe(0);
		expect(DCommon.or("c" as Input, [isA, isB])).toBe(false);

		type CheckResult = DCommon.ExpectType<typeof result, "c" | 0, "strict">;
	});

	it("keeps the false branch unreachable when every input member is recognized", () => {
		const input = 42 as string | number;
		const isString = DCommon.isType("string");
		const isNumber = DCommon.isType("number");

		if (DCommon.or(input, [isString, isNumber])) {
			type CheckInput = DCommon.ExpectType<typeof input, string | number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, never, "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isString, isNumber]), () => "matched" as const),
		);

		expect(result).toBe("matched");

		type CheckResult = DCommon.ExpectType<typeof result, "matched", "strict">;
	});

	it("preserves other predicate outputs when a predicate recognizes never", () => {
		type Input = string | number | null;
		const input = "value" as Input;
		const neverMatches = (_value: Input): _value is never => false;
		const isString = DCommon.isType("string");

		if (DCommon.or(input, [isString, neverMatches])) {
			type CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number | null, "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isString, neverMatches]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return 0 as const;
			}),
		);

		expect(result).toBe(0);
		expect(DCommon.or(input, [neverMatches, isString])).toBe(true);
		expect(DCommon.or(42 as Input, [isString, neverMatches])).toBe(false);

		const multipleInput = 42 as Input;
		const isNumber = DCommon.isType("number");

		if (DCommon.or(multipleInput, [isString, neverMatches, isNumber])) {
			type CheckInput = DCommon.ExpectType<typeof multipleInput, string | number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof multipleInput, null, "strict">;
		}

		expect(DCommon.or(multipleInput, [isString, neverMatches, isNumber])).toBe(true);

		type CheckResult = DCommon.ExpectType<typeof result, number | null, "strict">;
	});

	it("returns boolean when recognized types are absent from the input", () => {
		const input = 42 as number;
		const isString = DCommon.isType("string");
		const isNull = DCommon.isType("null");

		if (DCommon.or(input, [isString, isNull])) {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([isString, isNull]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "matched" as const;
			}),
		);

		expect(result).toBe(42);
		expect(DCommon.or(input, [isString, isNull])).toBe(false);
	});

	it("keeps a legitimate never guard when no predicate recognizes a value", () => {
		const input = "value" as string | number;
		const neverMatches = (_value: string | number): _value is never => false;
		const callback = vi.fn();
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([neverMatches, neverMatches]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return 0 as const;
			}),
		);

		expect(result).toBe(input);
		expect(callback).not.toHaveBeenCalled();
		expect(DCommon.or(input, [neverMatches, neverMatches])).toBe(false);
	});

	it("returns boolean when a guard is combined with an ordinary test", () => {
		const input = -3 as number;
		const direct = DCommon.or(input, [DNumber.isPositive, DNumber.isMultipleOf(2 as number)] as const);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number, "strict">;
		}

		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.or([DNumber.isPositive, DNumber.isMultipleOf(2 as number)]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "matched" as const;
			}),
		);

		expect(direct).toBe(false);
		expect(result).toBe(-3);

		type CheckResult = DCommon.ExpectType<typeof result, number | "matched", "strict">;
	});

	it("returns boolean for a union of predicate lists", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const compare = (
			predicates:
				| readonly [typeof isString, typeof isString]
				| readonly [typeof isNumber, typeof isNumber],
		) => {
			const input = "value" as Input;
			const direct = DCommon.or(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const curried = DCommon.pipe(
				input,
				DCommon.when(DCommon.or(predicates), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare([isString, isString])).toStrictEqual([true, 0]);
		expect(compare([isNumber, isNumber])).toStrictEqual([false, "value"]);
	});

	it("returns boolean for a union of predicates inside a list", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const neverMatches = (_value: Input): _value is never => false;
		const compare = (predicate: typeof isString | typeof isNumber) => {
			const input = "value" as Input;
			const direct = DCommon.or(input, [predicate, neverMatches]);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const curried = DCommon.pipe(
				input,
				DCommon.when(DCommon.or([predicate, neverMatches]), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare(isString)).toStrictEqual([true, 0]);
		expect(compare(isNumber)).toStrictEqual([false, "value"]);
	});

	it("returns boolean when a variadic list can contain additional guards", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const isNull = (value: Input): value is null => DCommon.isType(value, "null");
		const compare = (predicates: readonly [typeof isString, typeof isNumber, ...typeof isNull[]]) => {
			const input = null as Input;
			const direct = DCommon.or(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const curried = DCommon.pipe(
				input,
				DCommon.when(DCommon.or(predicates), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare([isString, isNumber])).toStrictEqual([false, null]);
		expect(compare([isString, isNumber, isNull])).toStrictEqual([true, 0]);
	});
});
