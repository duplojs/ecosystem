import * as DCommon from "@scripts/common";
import * as DNumber from "@scripts/number";
import * as DPattern from "@scripts/pattern";
import * as DString from "@scripts/string";

describe("whenNot", () => {
	describe("nested predicates over literal unions", () => {
		type Input = "a" | "b" | 1 | 2 | null | undefined;
		type RejectedInput = "b" | 2 | null | undefined;
		type Result = "a" | 1 | false;
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

		it("preserves the same nested literal narrowing in when", () => {
			const input = 1 as Input;
			const result = DCommon.pipe(
				input,
				DCommon.when(
					DCommon.and([
						DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
						DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

						return false as const;
					},
				),
			);

			type CheckResult = DCommon.ExpectType<typeof result, RejectedInput | false, "strict">;

			expect(result).toBe(false);
		});

		it.each(cases)("narrows an intersection of equality predicates for $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(
				input,
				DCommon.and([DCommon.equal(["a", 1, 2]), DCommon.equal(["a", "b", 1])]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(
					DCommon.and([DCommon.equal(["a", 1, 2]), DCommon.equal(["a", "b", 1])]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Result, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Result, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});

		it.each(cases)("narrows a union of equality predicates for $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(input, DCommon.or([DCommon.equal("a"), DCommon.equal(1)]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

				return false as const;
			});
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(DCommon.or([DCommon.equal("a"), DCommon.equal(1)]), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

					return false as const;
				}),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Result, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Result, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});

		it.each(cases)("narrows and containing or predicates for $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(
				input,
				DCommon.and([
					DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
					DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
				]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(
					DCommon.and([
						DCommon.or([DCommon.equal("a"), DCommon.equal(1)]),
						DCommon.or([DCommon.equal("a"), DCommon.equal([1, 2])]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Result, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Result, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});

		it.each(cases)("narrows or containing and predicates for $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(
				input,
				DCommon.or([
					DCommon.and([DCommon.equal(["a", "b"]), DCommon.equal("a")]),
					DCommon.and([DCommon.equal([1, 2]), DCommon.equal(1)]),
				]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(
					DCommon.or([
						DCommon.and([DCommon.equal(["a", "b"]), DCommon.equal("a")]),
						DCommon.and([DCommon.equal([1, 2]), DCommon.equal(1)]),
					]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, RejectedInput, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Result, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Result, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});

		it.each(cases)("keeps the boolean fallback for a mixed and predicate with $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(
				input,
				DCommon.and([DCommon.equal(["a", 1]), (value): boolean => value !== undefined]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(
					DCommon.and([DCommon.equal(["a", 1]), (value): boolean => value !== undefined]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Input | false, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Input | false, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});

		it.each(cases)("keeps the boolean fallback for a mixed or predicate with $input", ({ input, expected }) => {
			const direct = DCommon.whenNot(
				input,
				DCommon.or([DCommon.equal("a"), (value): boolean => value === 1]),
				(value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return false as const;
				},
			);
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(
					DCommon.or([DCommon.equal("a"), (value): boolean => value === 1]),
					(value) => {
						type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

						return false as const;
					},
				),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Input | false, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, Input | false, "strict">;

			expect(direct).toBe(expected);
			expect(curried).toBe(expected);
		});
	});

	it.each([
		{
			input: "a" as "a" | "b" | "c",
			expected: "a",
		},
		{
			input: "b" as "a" | "b" | "c",
			expected: false,
		},
		{
			input: "c" as "a" | "b" | "c",
			expected: false,
		},
	])("infers a string literal equality predicate for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, DCommon.equal("a"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, "b" | "c", "strict">;

			return false as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.equal("a"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "b" | "c", "strict">;

				return false as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, "a" | false, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: 1 as 1 | 2 | 3,
			expected: false,
		},
		{
			input: 2 as 1 | 2 | 3,
			expected: 2,
		},
		{
			input: 3 as 1 | 2 | 3,
			expected: false,
		},
	])("infers a number literal equality predicate for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, DCommon.equal(2), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, 1 | 3, "strict">;

			return false as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.equal(2), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, 1 | 3, "strict">;

				return false as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, 2 | false, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "a" as "a" | "b" | 1 | 2 | undefined,
			expected: "a",
		},
		{
			input: "b" as "a" | "b" | 1 | 2 | undefined,
			expected: false,
		},
		{
			input: 1 as "a" | "b" | 1 | 2 | undefined,
			expected: 1,
		},
		{
			input: 2 as "a" | "b" | 1 | 2 | undefined,
			expected: false,
		},
		{
			input: undefined as "a" | "b" | 1 | 2 | undefined,
			expected: false,
		},
	])("infers an equality predicate across mixed literals for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, DCommon.equal(["a", 1]), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, "b" | 2 | undefined, "strict">;

			return false as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.equal(["a", 1]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "b" | 2 | undefined, "strict">;

				return false as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, "a" | 1 | false, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it("falls back to boolean for a union of predicates", () => {
		type Input = string | undefined;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isUndefined = (value: Input): value is undefined => DCommon.isType(value, "undefined");
		const inspect = (input: Input, predicate: typeof isString | typeof isUndefined) => {
			const callback = vi.fn();
			const direct = DCommon.whenNot(input, predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

				callback(value);

				return 0 as const;
			});
			const curried = DCommon.pipe(
				input,
				DCommon.whenNot(predicate, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					callback(value);

					return 0 as const;
				}),
			);

			type CheckDirect = DCommon.ExpectType<typeof direct, Input | 0, "strict">;
			type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

			return {
				direct,
				curried,
				callback,
			};
		};

		const rejectedString = inspect("value", isUndefined);
		expect(rejectedString.direct).toBe(0);
		expect(rejectedString.curried).toBe(0);
		expect(rejectedString.callback).toHaveBeenCalledTimes(2);
		expect(rejectedString.callback).toHaveBeenCalledWith("value");

		const rejectedUndefined = inspect(undefined, isString);
		expect(rejectedUndefined.direct).toBe(0);
		expect(rejectedUndefined.curried).toBe(0);
		expect(rejectedUndefined.callback).toHaveBeenCalledTimes(2);
		expect(rejectedUndefined.callback).toHaveBeenCalledWith(undefined);

		const acceptedString = inspect("value", isString);
		expect(acceptedString.direct).toBe("value");
		expect(acceptedString.curried).toBe("value");
		expect(acceptedString.callback).not.toHaveBeenCalled();

		const acceptedUndefined = inspect(undefined, isUndefined);
		expect(acceptedUndefined.direct).toBeUndefined();
		expect(acceptedUndefined.curried).toBeUndefined();
		expect(acceptedUndefined.callback).not.toHaveBeenCalled();
	});

	it.each([
		{
			input: "value" as string | undefined,
			expected: "value",
		},
		{
			input: undefined as string | undefined,
			expected: 0,
		},
	])("falls back to boolean for an erased predicate output with $input", ({ input, expected }) => {
		const predicate: DCommon.AnyPredicate<string | undefined> = DCommon.isType("string");
		const direct = DCommon.whenNot(input, predicate, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, string | undefined | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "value" as string | undefined,
			expected: "value",
		},
		{
			input: undefined as string | undefined,
			expected: 0,
		},
	])("prioritizes a single predicate for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, (value) => DCommon.isType(value, "string"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot((value) => DCommon.isType(value, "string"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, string | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "value" as string | undefined,
			expected: "value",
		},
		{
			input: undefined as string | undefined,
			expected: 0,
		},
	])("keeps the full input for an explicit boolean test with $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, (value): boolean => DCommon.isType(value, "string"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot((value): boolean => DCommon.isType(value, "string"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, string | undefined | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it("preserves a predicate recognizing never", () => {
		const input = "value" as string | undefined;
		const predicate = (_value: typeof input): _value is never => false;
		const direct = DCommon.whenNot(input, predicate, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, typeof input, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, typeof input, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(0);
		expect(curried).toBe(0);
	});

	it("preserves explicit predicate type arguments", () => {
		const input = undefined as string | undefined;
		const direct = DCommon.whenNot<string | undefined, string, 0>(input, DCommon.isType("string"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

			return 0;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot<string | undefined, string, 0>(DCommon.isType("string"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

				return 0;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, string | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(0);
		expect(curried).toBe(0);
	});

	it("falls back to boolean when the predicate output is absent from the input", () => {
		const input = 42 as number;
		const predicate = DCommon.isType("string");
		const direct = DCommon.whenNot(input, predicate, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

			return "handled" as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "handled" as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, number | "handled", "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe("handled");
		expect(curried).toBe("handled");
	});

	it.each([
		{
			input: 2,
			expected: 2,
		},
		{
			input: -3,
			expected: "handled",
		},
	])("preserves a constrained predicate for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, DNumber.isPositive, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

			return "handled" as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DNumber.isPositive, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "handled" as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, (number & DNumber.Positive) | "handled", "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "value" as string | undefined,
			expected: 0,
		},
		{
			input: undefined as string | undefined,
			expected: undefined,
		},
	])("instantiates a generic predicate against the input for $input", ({ input, expected }) => {
		const predicate = <GenericInput extends string | undefined>(
			value: GenericInput,
		): value is Exclude<GenericInput, string> => value === undefined;
		const direct = DCommon.whenNot(input, predicate, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, undefined | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "accepted" as string | undefined,
			expected: "accepted",
		},
		{
			input: "other" as string | undefined,
			expected: 0,
		},
		{
			input: undefined as string | undefined,
			expected: 0,
		},
	])("preserves a literal predicate within a broad input for $input", ({ input, expected }) => {
		const direct = DCommon.whenNot(input, DCommon.equal("accepted"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

			return 0 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.equal("accepted"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string | undefined, "strict">;

				return 0 as const;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, "accepted" | 0, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "value" as string | number | undefined,
			expected: "value",
		},
		{
			input: 42 as string | number | undefined,
			expected: 42,
		},
		{
			input: undefined as string | number | undefined,
			expected: null,
		},
	])("preserves a single predicate recognizing a union for $input", ({ input, expected }) => {
		const predicate = (value: typeof input): value is string | number => value !== undefined;
		const direct = DCommon.whenNot(input, predicate, (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

			return null;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, undefined, "strict">;

				return null;
			}),
		);

		type CheckDirect = DCommon.ExpectType<typeof direct, string | number | null, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
	});

	it.each([
		{
			input: "a",
			expected: "rejected",
		},
		{
			input: "ab",
			expected: "ab",
		},
	])("preserves boolean inference when composed inside whenNot for $input", ({ input, expected }) => {
		const result = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.and([DString.test(/a/), DString.test(/b/)]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return "rejected" as const;
			}),
		);

		expect(result).toBe(expected);

		type CheckResult = DCommon.ExpectType<typeof result, string, "strict">;
	});
	it("preserves a composed structural predicate inside whenNot", () => {
		type Input = {
			kind: "a";
			amount: number;
		} | {
			kind: "b";
			label: string;
		} | {
			kind: "c";
			enabled: boolean;
		};
		const input = {
			kind: "c",
			enabled: true,
		} as Input;
		const isA = (value: Input) => DPattern.isMatch(value, { kind: "a" });
		const isObject = (value: Input): value is Input => DCommon.isType(value, "object");
		const predicate = DCommon.and<Input, readonly [typeof isA, typeof isObject]>([isA, isObject]);
		const result = DCommon.pipe(
			input,
			DCommon.whenNot(predicate, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, {
					kind: "b";
					label: string;
				} | {
					kind: "c";
					enabled: boolean;
				}, "strict">;

				return 1 as const;
			}),
		);

		expect(result).toBe(1);

		type CheckResult = DCommon.ExpectType<typeof result, {
			kind: "a";
			amount: number;
		} | 1, "strict">;

		const nested = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.and([DPattern.isMatch({ kind: "a" }), DCommon.isType("object")]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Exclude<Input, { kind: "a" }>, "strict">;

				return 1 as const;
			}),
		);

		type CheckNested = DCommon.ExpectType<typeof nested, Extract<Input, { kind: "a" }> | 1, "strict">;

		expect(nested).toBe(1);
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
	])("preserves number inference with a dynamic threshold for $input", ({ input, threshold, expected }) => {
		const direct = DCommon.whenNot(input, DNumber.greaterThan(threshold), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

			return "handled" as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DNumber.greaterThan(threshold), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, number, "strict">;

				return "handled" as const;
			}),
		);

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);

		type CheckDirect = DCommon.ExpectType<typeof direct, number | "handled", "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("keeps never when the predicate accepts every possible input", () => {
		const input = "value" as string;
		const callback = vi.fn();
		const direct = DCommon.whenNot(input, DCommon.isType("string"), (value) => {
			type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

			callback(value);

			return 1 as const;
		});
		const curried = DCommon.pipe(
			input,
			DCommon.whenNot(DCommon.isType("string"), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return 1 as const;
			}),
		);

		expect(direct).toBe(input);
		expect(curried).toBe(input);
		expect(callback).not.toHaveBeenCalled();

		type CheckDirect = DCommon.ExpectType<typeof direct, string | 1, "strict">;
		type CheckCurried = DCommon.ExpectType<typeof curried, typeof direct, "strict">;
	});

	it("runs the callback when the predicate rejects the input", () => {
		const input = 42 as string | number | null;
		const result = DCommon.whenNot(
			input,
			(value): value is string => typeof value === "string",
			(value) => {
				type _CheckValue = DCommon.ExpectType<
					typeof value,
					number | null,
					"strict"
				>;

				return value === null
					? "null"
					: value.toFixed(2);
			},
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("42.00");
	});

	it("returns the input when the predicate accepts it", () => {
		const input = "value" as string | number | null;
		const result = DCommon.whenNot(
			input,
			(value): value is string => typeof value === "string",
			(value) => value === null
				? "null"
				: value.toFixed(2),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("value");
	});

	it("supports curried usage in a pipe", () => {
		const result = DCommon.pipe(
			42 as string | number,
			DCommon.whenNot(
				(input): input is string => typeof input === "string",
				(input) => input.toFixed(2),
			),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string,
			"strict"
		>;

		expect(result).toBe("42.00");
	});
});
