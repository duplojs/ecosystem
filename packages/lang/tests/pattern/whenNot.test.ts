import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";
import * as DPattern from "@scripts/pattern";

describe("pattern whenNot", () => {
	it("rejects predicates that cannot accept every unhandled input", () => {
		const input = 1 as "a" | 1;
		const predicate = (value: string): boolean => DCommon.equal(value, "a");

		// @ts-expect-error The predicate must also accept the numeric input.
		const direct = DPattern.whenNot(input, predicate, () => false);
		const curried = DCommon.pipe(
			input,
			// @ts-expect-error The predicate must also accept the numeric input.
			DPattern.whenNot(predicate, () => false),
		);

		expect(direct).toStrictEqual(DPattern.result(false));
		expect(curried).toStrictEqual(DPattern.result(false));
	});

	describe("uncertain predicate outputs", () => {
		type Input = "a" | 1 | undefined;
		const isA = (value: Input): value is "a" => DCommon.equal(value, "a");
		const isOne = (value: Input): value is 1 => DCommon.equal(value, 1);

		it.each([
			{
				input: "a" as Input,
				predicate: isA,
				expected: "a",
			},
			{
				input: "a" as Input,
				predicate: isOne,
				expected: DPattern.result(false),
			},
			{
				input: 1 as Input,
				predicate: isA,
				expected: DPattern.result(false),
			},
			{
				input: 1 as Input,
				predicate: isOne,
				expected: 1,
			},
			{
				input: undefined as Input,
				predicate: isA,
				expected: DPattern.result(false),
			},
		])("falls back to boolean for a union of predicates with $input", ({ input, predicate, expected }) => {
			const direct = DPattern.whenNot(input, predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

				return false as const;
			});
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(predicate, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				}),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Input | DPattern.PatternResult<false>, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});

		it.each([
			{
				input: "a" as Input,
				expected: "a",
			},
			{
				input: 1 as Input,
				expected: DPattern.result(false),
			},
			{
				input: undefined as Input,
				expected: DPattern.result(false),
			},
		])("falls back to boolean for an erased predicate output with $input", ({ input, expected }) => {
			const predicate: DCommon.AnyPredicate<Input> = isA;

			const direct = DPattern.whenNot(input, predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

				return false as const;
			});
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(predicate, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				}),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Input | DPattern.PatternResult<false>, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});
	});
	describe("nested literal predicates", () => {
		type Value = "a" | "b" | 1 | 2 | null | undefined;
		type Input = Value | DPattern.PatternResult<"previous">;
		type RejectedValue = "b" | 2 | null | undefined;
		const previous = DPattern.result("previous");
		const cases = [
			{
				input: "a" as Input,
				expected: "a",
			},
			{
				input: "b" as Input,
				expected: DPattern.result(false),
			},
			{
				input: 1 as Input,
				expected: 1,
			},
			{
				input: 2 as Input,
				expected: DPattern.result(false),
			},
			{
				input: null as Input,
				expected: DPattern.result(false),
			},
			{
				input: undefined as Input,
				expected: DPattern.result(false),
			},
			{
				input: previous as Input,
				expected: previous,
			},
		];

		it.each(cases)("narrows and of equality predicates for $input", ({ input, expected }) => {
			const direct = DPattern.whenNot(
				input,
				DCommon.and([DCommon.equal(["a", 1, 2]), DCommon.equal(["a", "b", 1])]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(
					DCommon.and([DCommon.equal(["a", 1, 2]), DCommon.equal(["a", "b", 1])]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<
				typeof direct,
				"a" | 1 | DPattern.PatternResult<false> | DPattern.PatternResult<"previous">,
				"strict"
			>;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});

		it.each(cases)("narrows or of equality predicates for $input", ({ input, expected }) => {
			const direct = DPattern.whenNot(
				input,
				DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(
					DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<
				typeof direct,
				"a" | 1 | DPattern.PatternResult<false> | DPattern.PatternResult<"previous">,
				"strict"
			>;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});

		it.each(cases)("narrows and containing or predicates for $input", ({ input, expected }) => {
			const direct = DPattern.whenNot(
				input,
				DCommon.and([
					DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
					DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
				]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(
					DCommon.and([
						DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
						DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<
				typeof direct,
				"a" | 1 | DPattern.PatternResult<false> | DPattern.PatternResult<"previous">,
				"strict"
			>;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});

		it.each(cases)("narrows or containing and predicates for $input", ({ input, expected }) => {
			const direct = DPattern.whenNot(
				input,
				DCommon.or([
					DCommon.and([DCommon.equal(["a", "b"]), DCommon.equal("a")]),
					DCommon.and([DCommon.equal([1, 2]), DCommon.equal(1)]),
				]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DPattern.whenNot(
					DCommon.or([
						DCommon.and([DCommon.equal(["a", "b"]), DCommon.equal("a")]),
						DCommon.and([DCommon.equal([1, 2]), DCommon.equal(1)]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<
				typeof direct,
				"a" | 1 | DPattern.PatternResult<false> | DPattern.PatternResult<"previous">,
				"strict"
			>;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			expect(direct).toStrictEqual(expected);
			expect(curried).toStrictEqual(expected);
		});
	});
	it("match", () => {
		const result = DPattern.whenNot(
			"laravel" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toStrictEqual(DPattern.result("laravel"));

		type check = DCommon.ExpectType<
			typeof result,
			"duplojs" | DPattern.PatternResult<"laravel">,
			"strict"
		>;
	});

	it.each([
		{
			input: 2,
			threshold: 5,
			expected: DPattern.result(3),
		},
		{
			input: 8,
			threshold: 5,
			expected: 8,
		},
	])("keeps number inference with a dynamic threshold for $input", ({ input, threshold, expected }) => {
		const result = DPattern.whenNot(
			input,
			DNumber.greaterThan(threshold),
			(value) => {
				type checkValue = DCommon.ExpectType<typeof value, number, "strict">;

				return DNumber.sum([value, 1]);
			},
		);

		expect(result).toStrictEqual(expected);

		type check = DCommon.ExpectType<
			typeof result,
			number | DPattern.PatternResult<number>,
			"strict"
		>;
	});

	it.each([
		{
			input: 2,
			threshold: 5,
			expected: DPattern.result(3),
		},
		{
			input: 8,
			threshold: 5,
			expected: 8,
		},
	])("keeps number inference with a dynamic threshold in a pipe for $input", ({ input, threshold, expected }) => {
		const result = DCommon.pipe(
			input,
			DPattern.whenNot(DNumber.greaterThan(threshold), (value) => {
				type checkValue = DCommon.ExpectType<typeof value, number, "strict">;

				return DNumber.sum([value, 1]);
			}),
		);

		expect(result).toStrictEqual(expected);

		type check = DCommon.ExpectType<
			typeof result,
			number | DPattern.PatternResult<number>,
			"strict"
		>;
	});

	it.each([
		{
			input: -2,
			expected: DPattern.result(-1),
		},
		{
			input: 2,
			expected: 2,
		},
	])("preserves the positive branch for $input", ({ input, expected }) => {
		const result = DPattern.whenNot(input, DNumber.isPositive, (value) => {
			type checkValue = DCommon.ExpectType<typeof value, number, "strict">;

			return DNumber.sum([value, 1]);
		});

		expect(result).toStrictEqual(expected);

		type check = DCommon.ExpectType<
			typeof result,
			(number & DNumber.Positive) | DPattern.PatternResult<number>,
			"strict"
		>;
	});

	it.each([
		{
			input: -2,
			expected: DPattern.result(-1),
		},
		{
			input: 2,
			expected: 2,
		},
	])("preserves the positive branch in a pipe for $input", ({ input, expected }) => {
		const result = DCommon.pipe(
			input,
			DPattern.whenNot(DNumber.isPositive, (value) => {
				type checkValue = DCommon.ExpectType<typeof value, number, "strict">;

				return DNumber.sum([value, 1]);
			}),
		);

		expect(result).toStrictEqual(expected);

		type check = DCommon.ExpectType<
			typeof result,
			(number & DNumber.Positive) | DPattern.PatternResult<number>,
			"strict"
		>;
	});

	it("preserves the even constraint in both forms", () => {
		const input = 2 as number;
		const direct = DPattern.whenNot(input, DNumber.isEven, (value) => DNumber.sum([value, 1]));
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(DNumber.isEven, (value) => DNumber.sum([value, 1])),
		);

		expect(direct).toBe(2);
		expect(curried).toBe(2);

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			(number & DNumber.Even) | DPattern.PatternResult<number>,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("preserves the literal threshold constraint in both forms", () => {
		const input = 8 as number;
		const direct = DPattern.whenNot(input, DNumber.greaterThan(5), (value) => DNumber.sum([value, 1]));
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(DNumber.greaterThan(5), (value) => DNumber.sum([value, 1])),
		);

		expect(direct).toBe(8);
		expect(curried).toBe(8);

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			(number & DNumber.GreaterThan<5>) | DPattern.PatternResult<number>,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("passes previous results through without invoking the predicate or callback", () => {
		const input = DPattern.result("previous") as number | DPattern.PatternResult<string>;
		const predicate = vi.fn(DNumber.greaterThan(5 as number));
		const callback = vi.fn((value: number) => DNumber.sum([value, 1]));
		const direct = DPattern.whenNot(input, predicate, callback);
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(predicate, callback),
		);

		expect(direct).toBe(input);
		expect(curried).toBe(input);
		expect(predicate).not.toHaveBeenCalled();
		expect(callback).not.toHaveBeenCalled();

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			number | DPattern.PatternResult<string> | DPattern.PatternResult<number>,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("preserves inline structural predicate inference in both forms", () => {
		const input = {
			kind: "other",
			value: "payload",
		} as
			| {
				kind: "known";
				id: number;
			}
			| {
				kind: "other";
				value: string;
			};
		const direct = DPattern.whenNot(input, DPattern.isMatch({ kind: "known" }), (value) => {
			type checkValue = DCommon.ExpectType<typeof value, {
				kind: "other";
				value: string;
			}, "strict">;

			return value.value;
		});
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(DPattern.isMatch({ kind: "known" }), (value) => {
				type checkValue = DCommon.ExpectType<typeof value, {
					kind: "other";
					value: string;
				}, "strict">;

				return value.value;
			}),
		);

		expect(direct).toStrictEqual(DPattern.result("payload"));
		expect(curried).toStrictEqual(DPattern.result("payload"));

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			{
				kind: "known";
				id: number;
			} | DPattern.PatternResult<string>,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("keeps never when a guard accepts every input", () => {
		const input = 2 as number;
		const callback = vi.fn();
		const direct = DPattern.whenNot(input, DCommon.isType("number"), (value) => {
			type checkValue = DCommon.ExpectType<typeof value, never, "strict">;

			callback(value);

			return "handled" as const;
		});
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(DCommon.isType("number"), (value) => {
				type checkValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return "handled" as const;
			}),
		);

		expect(direct).toBe(input);
		expect(curried).toBe(input);
		expect(callback).not.toHaveBeenCalled();

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			number | DPattern.PatternResult<"handled">,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("discriminates primitive unions in both forms", () => {
		const input = 2 as string | number | null;
		const direct = DPattern.whenNot(input, DCommon.isType("string"), (value) => {
			type checkValue = DCommon.ExpectType<typeof value, number | null, "strict">;

			return value;
		});
		const curried = DCommon.pipe(
			input,
			DPattern.whenNot(DCommon.isType("string"), (value) => {
				type checkValue = DCommon.ExpectType<typeof value, number | null, "strict">;

				return value;
			}),
		);

		expect(direct).toStrictEqual(DPattern.result(2));
		expect(curried).toStrictEqual(DPattern.result(2));

		type checkDirect = DCommon.ExpectType<
			typeof direct,
			string | DPattern.PatternResult<number | null>,
			"strict"
		>;
		type checkCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("match", () => {
		const result = DPattern.whenNot(
			"duplojs" as "duplojs" | "laravel",
			(value) => value === "duplojs",
			(value) => value,
		);

		expect(result).toBe("duplojs");

		type check = DCommon.ExpectType<
			typeof result,
			"duplojs" | DPattern.PatternResult<"laravel">,
			"strict"
		>;
	});

	it("wraps unmatched input into pattern result", () => {
		const result = DCommon.pipe(
			"duplojs" as "duplojs" | "laravel",
			DPattern.whenNot(
				(value) => value === "duplojs",
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"laravel",
						"strict"
					>;

					return {
						framework: value,
						matched: false as const,
					};
				},
			),
			DPattern.when(
				DCommon.equal("duplojs"),
				(value) => {
					type checkValue = DCommon.ExpectType<
						typeof value,
						"duplojs",
						"strict"
					>;

					return {
						framework: value,
						matched: false as const,
					};
				},
			),
			DPattern.exhaustive,
		);

		expect(result).toStrictEqual({
			framework: "duplojs",
			matched: false,
		});

		type check = DCommon.ExpectType<
			typeof result,
			{
				framework: "duplojs";
				matched: false;
			} | {
				framework: "laravel";
				matched: false;
			},
			"strict"
		>;
	});
});
