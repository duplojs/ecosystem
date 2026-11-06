import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";
import * as DPattern from "@scripts/pattern";

describe("pattern match builder", () => {
	it("does not invoke whenNot after an earlier branch has matched", () => {
		const predicate = vi.fn();
		const callback = vi.fn();
		const result = DPattern.match("previous" as "previous" | "a" | undefined)
			.with("previous", () => "done" as const)
			.whenNot(
				(value): value is "a" => {
					predicate(value);

					return DCommon.equal(value, "a");
				},
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

					callback(value);

					return false as const;
				},
			)
			.otherwise((value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "a", "strict">;

				return value;
			});

		type CheckResult = DCommon.ExpectType<typeof result, "done" | "a" | false, "strict">;

		expect(result).toBe("done");
		expect(predicate).not.toHaveBeenCalled();
		expect(callback).not.toHaveBeenCalled();
	});

	it.each([
		{
			input: "a" as "a" | "b" | 1,
			expected: "a",
		},
		{
			input: "b" as "a" | "b" | 1,
			expected: false,
		},
	])("becomes exhaustive after handling the values retained by whenNot for $input", ({ input, expected }) => {
		const result = DPattern.match(input)
			.whenNot(DCommon.or([DCommon.equal("a"), DCommon.equal(1)]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "b", "strict">;

				return false as const;
			})
			.with("a", (value) => value)
			.with(1, (value) => value)
			.exhaustive();

		type CheckResult = DCommon.ExpectType<typeof result, "a" | 1 | false, "strict">;

		expect(result).toBe(expected);
	});

	it("rejects predicates that cannot accept every remaining input", () => {
		const input = 1 as "a" | 1;
		const predicate = (value: string): boolean => DCommon.equal(value, "a");
		const result = DPattern.match(input)
			// @ts-expect-error The predicate must also accept the numeric input.
			.whenNot(predicate, () => false)
			.otherwise((value) => value);

		expect(result).toBe(false);
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
				expected: false,
			},
			{
				input: 1 as Input,
				predicate: isA,
				expected: false,
			},
			{
				input: 1 as Input,
				predicate: isOne,
				expected: 1,
			},
			{
				input: undefined as Input,
				predicate: isA,
				expected: false,
			},
		])("falls back to boolean for a union of predicates with $input", ({ input, predicate, expected }) => {
			const result = DPattern.match(input)
				.whenNot(predicate, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				})
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, Input | false, "strict">;

			expect(result).toBe(expected);
		});

		it.each([
			{
				input: "a" as Input,
				expected: "a",
			},
			{
				input: 1 as Input,
				expected: false,
			},
			{
				input: undefined as Input,
				expected: false,
			},
		])("falls back to boolean for an erased predicate output with $input", ({ input, expected }) => {
			const predicate: DCommon.AnyPredicate<Input> = isA;

			const result = DPattern.match(input)
				.whenNot(predicate, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				})
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, Input | false, "strict">;

			expect(result).toBe(expected);
		});
	});
	describe("nested literal predicates", () => {
		type Value = "a" | "b" | 1 | 2 | null | undefined;
		type Input = Value;
		type RejectedValue = "b" | 2 | null | undefined;
		const cases = [
			{
				input: "a" as Input,
				expected: "a",
			},
			{
				input: "b" as Input,
				expected: false,
			},
			{
				input: 1 as Input,
				expected: 1,
			},
			{
				input: 2 as Input,
				expected: false,
			},
			{
				input: null as Input,
				expected: false,
			},
			{
				input: undefined as Input,
				expected: false,
			},
		];

		it.each(cases)("narrows and of equality predicates for $input", ({ input, expected }) => {
			const result = DPattern.match(input)
				.whenNot(
					DCommon.and([DCommon.equal(["a", 1, 2]), DCommon.equal(["a", "b", 1])]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				)
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, "a" | 1 | false, "strict">;

			expect(result).toBe(expected);
		});

		it.each(cases)("narrows or of equality predicates for $input", ({ input, expected }) => {
			const result = DPattern.match(input)
				.whenNot(
					DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				)
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, "a" | 1 | false, "strict">;

			expect(result).toBe(expected);
		});

		it.each(cases)("narrows and containing or predicates for $input", ({ input, expected }) => {
			const result = DPattern.match(input)
				.whenNot(
					DCommon.and([
						DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
						DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				)
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, "a" | 1 | false, "strict">;

			expect(result).toBe(expected);
		});

		it.each(cases)("narrows or containing and predicates for $input", ({ input, expected }) => {
			const result = DPattern.match(input)
				.whenNot(
					DCommon.or([
						DCommon.and([DCommon.equal(["a", "b"]), DCommon.equal("a")]),
						DCommon.and([DCommon.equal([1, 2]), DCommon.equal(1)]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedValue, "strict">;

						return false as const;
					},
				)
				.otherwise((value) => {
					type CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

					return value;
				});

			type CheckResult = DCommon.ExpectType<typeof result, "a" | 1 | false, "strict">;

			expect(result).toBe(expected);
		});
	});
	it.each([
		{
			input: 2,
			threshold: 5,
			expected: "handled",
		},
		{
			input: 8,
			threshold: 5,
			expected: 8,
		},
	])("preserves boolean predicate inference with a dynamic threshold for $input", ({ input, threshold, expected }) => {
		const result = DPattern.match(input)
			.whenNot(DNumber.greaterThan(threshold), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "handled" as const;
			})
			.otherwise((value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return value;
			});

		expect(result).toBe(expected);

		type CheckResult = DCommon.ExpectType<typeof result, number | "handled", "strict">;
	});

	it("preserves positive numbers for the fallback and rejects premature exhaustiveness", () => {
		const builder = DPattern.match(2 as number)
			.whenNot(DNumber.isPositive, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "handled" as const;
			});
		const result = builder.otherwise((value) => {
			type CheckValue = DCommon.ExpectType<typeof value, number & DNumber.Positive, "strict">;

			return value;
		});

		expect(result).toBe(2);
		// @ts-expect-error Positive numbers still need a handler.
		expect(() => builder.exhaustive()).toThrow(DPattern.InvalidExhaustivePatternError);

		type CheckResult = DCommon.ExpectType<typeof result, (number & DNumber.Positive) | "handled", "strict">;
	});

	it("keeps never when a guard accepts every remaining input", () => {
		const callback = vi.fn();
		const result = DPattern.match("value" as string)
			.whenNot(DCommon.isType("string"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return 1 as const;
			})
			.otherwise((value) => value);

		expect(result).toBe("value");
		expect(callback).not.toHaveBeenCalled();

		type CheckResult = DCommon.ExpectType<typeof result, string | 1, "strict">;
	});

	it("matches with builder and falls back to otherwise", () => {
		expect(
			DPattern.match<"foo" | "bar">("foo")
				.with(
					"foo",
					(value) => {
						type Check = DCommon.ExpectType<
							typeof value,
							"foo",
							"strict"
						>;

						return 12;
					},
				)
				.otherwise((rest) => {
					type Check = DCommon.ExpectType<
						typeof rest,
						"bar",
						"strict"
					>;

					return `rest-${rest}`;
				}),
		).toBe(12);

		expect(
			DPattern.match<"foo" | "bar">("bar")
				.when(DCommon.equal("foo"), (value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						"foo",
						"strict"
					>;

					return 12;
				})
				.otherwise((rest) => `rest-${rest}`),
		).toBe("rest-bar");
	});

	it("applies first matching with", () => {
		expect(
			DPattern.match<"foo" | "bar" | "baz">("bar")
				.with("foo", () => "first")
				.with("bar", () => 24)
				.with("baz", () => "last")
				.exhaustive(),
		).toBe(24);
	});

	it("supports predicate via when", () => {
		const result = DPattern.match<number | string>(42)
			.when(DCommon.isType("number"), (num) => num + 1)
			.otherwise((rest) => String(rest));

		type Check = DCommon.ExpectType<
			typeof result,
			string | number,
			"strict"
		>;

		expect(result).toBe(43);
	});

	it("supports predicate via whenNot", () => {
		const result = DPattern.match(false ? [1] : undefined)
			.whenNot(
				DCommon.isType("array"),
				(value) => {
					type Check = DCommon.ExpectType<
						typeof value,
						undefined,
						"strict"
					>;

					return <const>"isDown";
				},
			)
			.otherwise((value) => value);

		type check = DCommon.ExpectType<
			typeof result,
			"isDown" | number[],
			"strict"
		>;

		expect(result).toBe("isDown");
	});

	it("throws when exhaustive is not satisfied", () => {
		const builder = DPattern.match<"foo" | "bar">("bar")
			.with("foo", () => "ok");

		expect(
			() => (builder.exhaustive as unknown as DCommon.AnyFunction)(),
		).toThrow(DPattern.InvalidExhaustivePatternError);
	});

	it("returns value when exhaustive matches", () => {
		expect(
			DPattern.match<"foo" | "bar">("foo")
				.with("foo", (value) => `yes-${value}`)
				.when(DCommon.equal("bar"), () => 12)
				.exhaustive(),
		).toBe("yes-foo");
	});

	it("supports unknown value", () => {
		void DPattern.match(42 as unknown)
			.with(
				DCommon.isType("number"),
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						number,
						"strict"
					>;
				},
			)
			.with(
				DCommon.isType("object"),
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						object,
						"strict"
					>;
				},
			)
			.with(
				DCommon.isType("array"),
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						DCommon.AnyValue[],
						"strict"
					>;
				},
			)
			.with(
				DCommon.isType("function"),
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						DCommon.AnyFunction,
						"strict"
					>;
				},
			)
			.otherwise(
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						string | bigint | boolean | null | undefined,
						"strict"
					>;
				},
			);
	});

	it("supports deep unknown value", () => {
		void DPattern.match({ test: 42 as unknown })
			.with(
				{
					test: DPattern.union(
						DCommon.isType("string"),
						DCommon.isType("number"),
					),
				},
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						{
							test: string | number;
						},
						"strict"
					>;
				},
			)
			.with(
				{ test: DCommon.isType("object") },
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						{
							test: object;
						},
						"strict"
					>;
				},
			)
			.with(
				{
					test: DPattern.union(
						DCommon.isType("array"),
						DCommon.isType("function"),
					),
				},
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						{
							test: DCommon.AnyFunction | DCommon.AnyValue[];
						},
						"strict"
					>;
				},
			)
			.otherwise(
				(value) => {
					type check = DCommon.ExpectType<
						typeof value,
						{
							test?: bigint | boolean | null | undefined;
						},
						"strict"
					>;
				},
			);
	});

	it("Incomplete union on input", () => {
		const input = {
			rr: "ok",
		} as {
			test: string;
			tt: string;
			jj: { type: "oo" } | { type: "pp" };
		} | { rr: string };

		const result = DPattern.match(input)
			.with(
				DPattern.union(
					{
						test: "ok",
					},
					{
						tt: "ok",
						jj: { type: "oo" },
					},
				),
				(value) => {
					type check = DCommon.ExpectType<
							typeof value,
							{
								tt: string;
								jj: {
									type: "oo";
								} | {
									type: "pp";
								};
								test: "ok";
							} | {
								test: string;
								tt: "ok";
								jj: {
									type: "oo";
								};
							},
							"strict"
					>;

					return "with" as const;
				},
			)
			.otherwise((rest) => {
				type check = DCommon.ExpectType<
						typeof rest,
						{
							test: string;
							tt: string;
							jj: {
								type: "oo";
							} | {
								type: "pp";
							};
						} | {
							rr: string;
						},
						"strict"
				>;

				return "otherwise" as const;
			});

		type check = DCommon.ExpectType<
			typeof result,
			"with" | "otherwise",
			"strict"
		>;
	});
});
