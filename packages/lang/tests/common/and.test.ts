import * as DCommon from "@scripts/common";

describe("and", () => {
	it("returns true only when every predicate accepts the input", () => {
		const predicates = [
			(input: number) => input > 0,
			(input: number) => input % 2 === 0,
		] satisfies [
			(input: number) => boolean,
			(input: number) => boolean,
		];

		expect(DCommon.and(2, predicates)).toBe(true);
		expect(DCommon.and(3, predicates)).toBe(false);
		expect(DCommon.and(-2, predicates)).toBe(false);
	});

	it("supports curried predicates in a pipe", () => {
		const result = DCommon.pipe(
			2,
			DCommon.when(
				DCommon.and([
					(input: number) => input > 0,
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

	it("narrows when every predicate recognizes a single type", () => {
		const format = (input: string | number | null) => {
			if (
				DCommon.and(input, [
					(value): value is string => DCommon.isType(value, "string"),
					(value): value is string => typeof value === "string",
				])
			) {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					string,
					"strict"
				>;

				return input.toUpperCase();
			} else {
				type _CheckInput = DCommon.ExpectType<
					typeof input,
					number | null,
					"strict"
				>;

				return input;
			}
		};

		expect(format("value")).toBe("VALUE");
		expect(format(42)).toBe(42);
		expect(format(null)).toBeNull();
	});

	it.each([
		{
			input: "value" as string | number | null,
			expected: true,
			transformed: 0,
		},
		{
			input: 42 as string | number | null,
			expected: false,
			transformed: 42,
		},
		{
			input: null as string | number | null,
			expected: false,
			transformed: null,
		},
	])("intersects a union output at any tuple position for $input", ({ input, expected, transformed }) => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNotNull = (value: Input): value is string | number => value !== null;
		const first = DCommon.and(input, [isNotNull, isString]);
		const middle = DCommon.and(input, [isString, isNotNull, isString]);
		const last = DCommon.and(input, [isString, isNotNull]);

		if (first || middle || last) {
			type CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, number | null, "strict">;
		}

		const firstGuard = DCommon.and([isNotNull, isString]);
		const lastGuard = DCommon.and([isString, isNotNull]);
		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isString, isNotNull, isString]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, number | null, "strict">;

		expect(first).toBe(expected);
		expect(middle).toBe(expected);
		expect(last).toBe(expected);
		expect(DCommon.pipe(input, firstGuard)).toBe(expected);
		expect(DCommon.pipe(input, lastGuard)).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it("narrows in a pipe when a predicate recognizes a union", () => {
		const input = "value" as string | number | null;
		const isString = (value: string | number | null): value is string => DCommon.isType(value, "string");
		const isNotNull = (value: string | number | null): value is string | number => value !== null;
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isNotNull, isString]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof result, number | null, "strict">;

		expect(result).toBe(0);
	});

	it("rejects consuming a rejected number as a string", () => {
		type Input = string | number | null;
		const isNotNull = (value: Input): value is string | number => value !== null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const result = DCommon.pipe(
			42 as Input,
			DCommon.when(DCommon.and([isNotNull, isString]), () => "matched" as const),
		);

		type CheckResult = DCommon.ExpectType<typeof result, number | null | "matched", "strict">;
		const consumeString = (value: string | null) => value === null ? null : value.toUpperCase();
		// @ts-expect-error the rejected number must remain part of the result type
		const unsafeConsumption = () => consumeString(result);

		expect(result).toBe(42);
		expect(unsafeConsumption).toThrow(TypeError);
	});

	it("preserves predicate narrowing in a pipe for single outputs", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const format = (input: Input) => DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isString, isString]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return "matched" as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<ReturnType<typeof format>, number | null | "matched", "strict">;

		expect(format("value")).toBe("matched");
		expect(format(42)).toBe(42);
		expect(format(null)).toBeNull();
	});

	it("rejects consuming a rejected string as a number with disjoint outputs", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const result = DCommon.pipe(
			"value" as Input,
			DCommon.when(DCommon.and([isString, isNumber]), () => 0 as const),
		);

		type CheckResult = DCommon.ExpectType<typeof result, Input, "strict">;
		const consumeNumber = (value: number | null) => value === null ? null : value.toFixed(2);
		// @ts-expect-error the rejected string must remain part of the result type
		const unsafeConsumption = () => consumeNumber(result);

		expect(result).toBe("value");
		expect(unsafeConsumption).toThrow(TypeError);
	});

	it.each([
		{
			first: false,
			second: true,
			third: true,
			expected: false,
			secondCalls: 0,
			thirdCalls: 0,
		},
		{
			first: true,
			second: false,
			third: true,
			expected: false,
			secondCalls: 2,
			thirdCalls: 0,
		},
		{
			first: true,
			second: true,
			third: false,
			expected: false,
			secondCalls: 2,
			thirdCalls: 2,
		},
		{
			first: true,
			second: true,
			third: true,
			expected: true,
			secondCalls: 2,
			thirdCalls: 2,
		},
	])("short-circuits [$first, $second, $third] in both forms", ({ first, second, third, expected, secondCalls, thirdCalls }) => {
		const input = { value: 42 };
		const firstPredicate = vi.fn((_value: typeof input): boolean => first);
		const secondPredicate = vi.fn((_value: typeof input): boolean => second);
		const thirdPredicate = vi.fn((_value: typeof input): boolean => third);
		const predicates = [firstPredicate, secondPredicate, thirdPredicate] as const;
		const direct = DCommon.and(input, [firstPredicate, secondPredicate, thirdPredicate]);
		const curried = DCommon.pipe(input, DCommon.and(predicates));

		expect(direct).toBe(expected);
		expect(curried).toBe(expected);
		expect(firstPredicate).toHaveBeenCalledTimes(2);
		expect(firstPredicate).toHaveBeenNthCalledWith(1, input);
		expect(firstPredicate).toHaveBeenNthCalledWith(2, input);
		expect(secondPredicate).toHaveBeenCalledTimes(secondCalls);
		expect(thirdPredicate).toHaveBeenCalledTimes(thirdCalls);
	});

	it("passes the same input to each predicate in order", () => {
		const input = { value: 42 };
		const first = vi.fn((_value: typeof input): boolean => true);
		const second = vi.fn((_value: typeof input): boolean => true);
		const third = vi.fn((_value: typeof input): boolean => true);

		expect(DCommon.and(input, [first, second, third])).toBe(true);
		expect(first).toHaveBeenCalledExactlyOnceWith(input);
		expect(second).toHaveBeenCalledExactlyOnceWith(input);
		expect(third).toHaveBeenCalledExactlyOnceWith(input);
		expect(first).toHaveBeenCalledBefore(second);
		expect(second).toHaveBeenCalledBefore(third);
	});

	it("does not call a throwing predicate after a rejection", () => {
		const reject = vi.fn((_value: number): boolean => false);
		const throwing = vi.fn((_value: number): boolean => {
			throw new Error("must not be called");
		});

		expect(DCommon.and(42, [reject, throwing])).toBe(false);
		const result = DCommon.pipe(42, DCommon.and([reject, throwing]));

		expect(result).toBe(false);
		expect(throwing).not.toHaveBeenCalled();
	});

	it.each([
		{
			input: "a" as "a" | "b" | "c" | null,
			expected: false,
			transformed: "a",
		},
		{
			input: "b" as "a" | "b" | "c" | null,
			expected: true,
			transformed: 0,
		},
		{
			input: "c" as "a" | "b" | "c" | null,
			expected: false,
			transformed: "c",
		},
		{
			input: null as "a" | "b" | "c" | null,
			expected: false,
			transformed: null,
		},
	])("intersects overlapping output unions for $input", ({ input, expected, transformed }) => {
		type Input = "a" | "b" | "c" | null;
		const isAB = (value: Input): value is "a" | "b" => value === "a" || value === "b";
		const isBC = (value: Input): value is "b" | "c" => value === "b" || value === "c";
		const direct = DCommon.and(input, [isAB, isBC]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, "b", "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, "a" | "c" | null, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isAB, isBC]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "b", "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, "a" | "c" | null | 0, "strict">;
		const reversed = DCommon.and(input, [isBC, isAB]);

		if (reversed) {
			type CheckInput = DCommon.ExpectType<typeof input, "b", "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, "a" | "c" | null, "strict">;
		}

		expect(direct).toBe(expected);
		expect(reversed).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each([
		{
			input: true as boolean | null,
			expected: true,
			transformed: 0,
		},
		{
			input: false as boolean | null,
			expected: true,
			transformed: 0,
		},
		{
			input: null as boolean | null,
			expected: false,
			transformed: null,
		},
	])("preserves boolean predicate outputs for $input", ({ input, expected, transformed }) => {
		const isBoolean = (value: boolean | null): value is boolean => DCommon.isType(value, "boolean");
		const predicates = [isBoolean, isBoolean] as const;
		const direct = DCommon.and(input, predicates);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, boolean, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, null, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and(predicates), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, boolean, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, 0 | null, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each(["value", 42, null])("keeps disjoint predicates unreachable for $input", (input) => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const direct = DCommon.and(input, [isString, isNumber]);
		const callback = vi.fn();

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, never, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isString, isNumber]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return 0 as const;
			}),
		);

		expect(direct).toBe(false);
		expect(curried).toBe(input);
		expect(callback).not.toHaveBeenCalled();
	});

	it("returns boolean for a union of predicate lists", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		type PredicateLists = [typeof isString, typeof isString] | [typeof isNumber, typeof isNumber];
		const compare = (input: Input, predicates: PredicateLists) => {
			const direct = DCommon.and(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const guard = DCommon.and(predicates);
			type CheckGuard = DCommon.ExpectType<typeof guard, (value: Input) => boolean, "strict">;
			const curried = DCommon.pipe(
				input,
				DCommon.when(guard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			type CheckResult = DCommon.ExpectType<typeof curried, Input, "strict">;

			return [direct, curried] as const;
		};

		expect(compare("value", [isString, isString])).toStrictEqual([true, 0]);
		expect(compare(42, [isString, isString])).toStrictEqual([false, 42]);
		expect(compare(42, [isNumber, isNumber])).toStrictEqual([true, 0]);
		expect(compare("value", [isNumber, isNumber])).toStrictEqual([false, "value"]);
		expect(compare(null, [isNumber, isNumber])).toStrictEqual([false, null]);
	});

	it("returns boolean for a union of predicates at any tuple position", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const compare = (input: Input, predicate: typeof isString | typeof isNumber) => {
			const first = DCommon.and(input, [predicate, isString]);
			const middle = DCommon.and(input, [isString, predicate, isString]);
			const last = DCommon.and(input, [isString, predicate]);

			if (first || middle || last) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const firstGuard = DCommon.and([predicate, isString]);
			const middleGuard = DCommon.and([isString, predicate, isString]);
			const lastGuard = DCommon.and([isString, predicate]);
			type CheckFirst = DCommon.ExpectType<typeof firstGuard, (value: Input) => boolean, "strict">;
			type CheckMiddle = DCommon.ExpectType<typeof middleGuard, (value: Input) => boolean, "strict">;
			type CheckLast = DCommon.ExpectType<typeof lastGuard, (value: Input) => boolean, "strict">;
			const curried = DCommon.pipe(
				input,
				DCommon.when(middleGuard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			expect(DCommon.pipe(input, firstGuard)).toBe(first);
			expect(DCommon.pipe(input, lastGuard)).toBe(last);

			return [first, middle, last, curried] as const;
		};

		expect(compare("value", isString)).toStrictEqual([true, true, true, 0]);
		expect(compare("value", isNumber)).toStrictEqual([false, false, false, "value"]);
		expect(compare(42, isString)).toStrictEqual([false, false, false, 42]);
		expect(compare(42, isNumber)).toStrictEqual([false, false, false, 42]);
		expect(compare(null, isNumber)).toStrictEqual([false, false, false, null]);
	});

	it("returns boolean when a variadic list can contain additional predicates", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		const compare = (input: Input, predicates: [typeof isString, typeof isString, ...typeof isNumber[]]) => {
			const direct = DCommon.and(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const guard = DCommon.and(predicates);
			type CheckGuard = DCommon.ExpectType<typeof guard, (value: Input) => boolean, "strict">;
			const curried = DCommon.pipe(
				input,
				DCommon.when(guard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare("value", [isString, isString])).toStrictEqual([true, 0]);
		expect(compare("value", [isString, isString, isNumber])).toStrictEqual([false, "value"]);
		expect(compare("value", [isString, isString, isNumber, isNumber])).toStrictEqual([false, "value"]);
		expect(compare(null, [isString, isString])).toStrictEqual([false, null]);
	});

	it("returns boolean when a predicate recognizes never", () => {
		type Input = string | number | null;
		const input = "value" as Input;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const neverMatches = (_value: Input): _value is never => false;
		const first = DCommon.and(input, [neverMatches, isString]);
		const middle = DCommon.and(input, [isString, neverMatches, isString]);
		const last = DCommon.and(input, [isString, neverMatches]);

		if (first || middle || last) {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const firstGuard = DCommon.and([neverMatches, isString]);
		const middleGuard = DCommon.and([isString, neverMatches, isString]);
		const lastGuard = DCommon.and([isString, neverMatches]);
		type CheckFirst = DCommon.ExpectType<typeof firstGuard, (value: Input) => boolean, "strict">;
		type CheckMiddle = DCommon.ExpectType<typeof middleGuard, (value: Input) => boolean, "strict">;
		type CheckLast = DCommon.ExpectType<typeof lastGuard, (value: Input) => boolean, "strict">;
		const callback = vi.fn();
		const curried = DCommon.pipe(
			input,
			DCommon.when(middleGuard, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

				callback(value);

				return 0 as const;
			}),
		);

		expect(first).toBe(false);
		expect(middle).toBe(false);
		expect(last).toBe(false);
		expect(DCommon.pipe(input, firstGuard)).toBe(false);
		expect(DCommon.pipe(input, lastGuard)).toBe(false);
		expect(curried).toBe(input);
		expect(callback).not.toHaveBeenCalled();
	});

	it.each([
		{
			input: "value" as string | number | null,
			expected: true,
			transformed: 0,
		},
		{
			input: "" as string | number | null,
			expected: false,
			transformed: "",
		},
		{
			input: 42 as string | number | null,
			expected: false,
			transformed: 42,
		},
		{
			input: null as string | number | null,
			expected: false,
			transformed: null,
		},
	])("does not narrow mixed boolean and predicate tests for $input", ({ input, expected, transformed }) => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNotEmpty = (value: Input): boolean => value !== "";
		const direct = DCommon.and(input, [isString, isNotEmpty]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const guard = DCommon.and([isString, isNotEmpty]);
		type CheckGuard = DCommon.ExpectType<typeof guard, (value: Input) => boolean, "strict">;
		const curried = DCommon.pipe(
			input,
			DCommon.when(guard, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, Input, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each([
		{
			input: "value" as unknown,
			expected: true,
			transformed: 0,
		},
		{
			input: 42 as unknown,
			expected: false,
			transformed: 42,
		},
		{
			input: null as unknown,
			expected: false,
			transformed: null,
		},
	])("does not narrow a matching unknown input to never for $input", ({ input, expected, transformed }) => {
		const isString = (value: unknown): value is string => typeof value === "string";
		const direct = DCommon.and(input, [isString, isString]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, unknown, "strict">;
		}

		const guard = DCommon.and([isString, isString]);
		type CheckGuard = DCommon.ExpectType<typeof guard, (value: unknown) => value is string, "strict">;
		const curried = DCommon.pipe(
			input as string | number | null,
			DCommon.when(guard, (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

				return 0 as const;
			}),
		);

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each([
		{
			input: "accepted" as string | null,
			expected: true,
			transformed: 0,
		},
		{
			input: "other" as string | null,
			expected: false,
			transformed: "other",
		},
		{
			input: null as string | null,
			expected: false,
			transformed: null,
		},
	])("preserves a literal recognized inside a broad string input for $input", ({ input, expected, transformed }) => {
		const isAccepted = (value: string | null): value is "accepted" => value === "accepted";
		const direct = DCommon.and(input, [isAccepted, isAccepted]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, "accepted", "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, string | null, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isAccepted, isAccepted]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, "accepted", "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, string | null | 0, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each([
		{
			input: { value: "value" } as { value: string | number } | null,
			expected: true,
			transformed: 0,
		},
		{
			input: { value: 42 } as { value: string | number } | null,
			expected: false,
			transformed: { value: 42 },
		},
		{
			input: null as { value: string | number } | null,
			expected: false,
			transformed: null,
		},
	])("preserves structural narrowing for $input", ({ input, expected, transformed }) => {
		type Input = { value: string | number } | null;
		const hasString = (value: Input): value is { value: string } => value !== null && DCommon.isType(value.value, "string");
		const direct = DCommon.and(input, [hasString, hasString]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, { value: string }, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([hasString, hasString]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, { value: string }, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, Input | 0, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toStrictEqual(transformed);
	});

	it("returns boolean for a union of finite tuple lengths", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNumber = (value: Input): value is number => DCommon.isType(value, "number");
		type PredicateLists =
			| [typeof isString, typeof isString]
			| [typeof isString, typeof isString, typeof isNumber];
		const compare = (input: Input, predicates: PredicateLists) => {
			const direct = DCommon.and(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const guard = DCommon.and(predicates);
			type CheckGuard = DCommon.ExpectType<typeof guard, (value: Input) => boolean, "strict">;
			const curried = DCommon.pipe(
				input,
				DCommon.when(guard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare("value", [isString, isString])).toStrictEqual([true, 0]);
		expect(compare("value", [isString, isString, isNumber])).toStrictEqual([false, "value"]);
		expect(compare(42, [isString, isString, isNumber])).toStrictEqual([false, 42]);
	});

	it("accepts readonly boolean tuples in the curried overload", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const isNotEmpty = (value: Input): boolean => value !== "";
		const predicates = [isString, isNotEmpty] as const;
		const compare = (input: Input) => {
			const direct = DCommon.and(input, [isString, isNotEmpty]);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const curried = DCommon.pipe(
				input,
				DCommon.when(DCommon.and(predicates), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(compare("value")).toStrictEqual([true, 0]);
		expect(compare("")).toStrictEqual([false, ""]);
		expect(compare(42)).toStrictEqual([false, 42]);

		// @ts-expect-error the direct boolean overload requires a mutable tuple
		DCommon.and("value" as Input, predicates);
	});

	it("combines unknown with a specific predicate output in either order", () => {
		const acceptsAll = (value: unknown): value is unknown => true;
		const isString = (value: unknown): value is string => typeof value === "string";
		const inspect = (input: unknown) => {
			const direct = DCommon.and(input, [acceptsAll, isString]);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, string, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, unknown, "strict">;
			}

			const guard = DCommon.and([isString, acceptsAll]);
			type CheckGuard = DCommon.ExpectType<typeof guard, (value: unknown) => value is string, "strict">;
			const curried = DCommon.pipe(
				input as string | number | null,
				DCommon.when(guard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, string, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(inspect("value")).toStrictEqual([true, 0]);
		expect(inspect(42)).toStrictEqual([false, 42]);
		expect(inspect(null)).toStrictEqual([false, null]);
	});

	it("preserves literal inputs with broader outputs and readonly predicate tuples", () => {
		type Input = "accepted" | null;
		const isString = (value: string | null): value is string => DCommon.isType(value, "string");
		const predicates = [isString, isString] as const;
		const inspect = (input: Input) => {
			const direct = DCommon.and(input, predicates);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, "accepted", "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, null, "strict">;
			}

			const curried = DCommon.pipe(
				input,
				DCommon.when(DCommon.and(predicates), (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, "accepted", "strict">;

					return 0 as const;
				}),
			);

			type CheckResult = DCommon.ExpectType<typeof curried, 0 | null, "strict">;

			return [direct, curried] as const;
		};

		expect(inspect("accepted")).toStrictEqual([true, 0]);
		expect(inspect(null)).toStrictEqual([false, null]);
	});

	type StructuralInput = {
		first?: string;
		second?: number;
	} | null;

	it.each([
		{
			input: {
				first: "value",
				second: 42,
			} as StructuralInput,
			expected: true,
			transformed: 0,
		},
		{
			input: { first: "value" } as StructuralInput,
			expected: false,
			transformed: { first: "value" },
		},
		{
			input: { second: 42 } as StructuralInput,
			expected: false,
			transformed: { second: 42 },
		},
		{
			input: null as StructuralInput,
			expected: false,
			transformed: null,
		},
	])("retains every structural condition for $input", ({ input, expected, transformed }) => {
		type Input = StructuralInput;
		type First = NonNullable<Input> & { first: string };
		type Second = NonNullable<Input> & { second: number };
		const hasFirst = (value: Input): value is First => value !== null && DCommon.isType(value.first, "string");
		const hasSecond = (value: Input): value is Second => value !== null && DCommon.isType(value.second, "number");
		const direct = DCommon.and(input, [hasFirst, hasSecond, hasFirst]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, First & Second, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([hasSecond, hasFirst, hasSecond]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, First & Second, "strict">;

				return 0 as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, Input | 0, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toStrictEqual(transformed);
	});

	it("returns boolean when a predicate output has been widened to any", () => {
		type Input = string | number | null;
		const isString = (value: Input): value is string => DCommon.isType(value, "string");
		const erased: DCommon.AnyPredicate<Input> = isString;
		const inspect = (input: Input) => {
			const direct = DCommon.and(input, [erased, isString]);

			if (direct) {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			} else {
				type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
			}

			const guard = DCommon.and([isString, erased]);
			type CheckGuard = DCommon.ExpectType<typeof guard, (value: Input) => boolean, "strict">;
			const curried = DCommon.pipe(
				input,
				DCommon.when(guard, (value) => {
					type CheckValue = DCommon.ExpectType<typeof value, Input, "strict">;

					return 0 as const;
				}),
			);

			return [direct, curried] as const;
		};

		expect(inspect("value")).toStrictEqual([true, 0]);
		expect(inspect(42)).toStrictEqual([false, 42]);
	});

	it.each([
		{
			input: "value" as string | number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: 42 as string | number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: null as string | number | null,
			expected: false,
			transformed: null,
		},
	])("preserves every member of a common output union for $input", ({ input, expected, transformed }) => {
		type Input = string | number | null;
		const isNotNull = (value: Input): value is string | number => value !== null;
		const predicates = [isNotNull, isNotNull] as const;
		const direct = DCommon.and(input, predicates);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, string | number, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, null, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and(predicates), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, string | number, "strict">;

				return "matched" as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, "matched" | null, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});

	it.each(["a", "b", "c", "d", null] as const)("keeps disjoint output unions unreachable for $input", (value) => {
		type Input = "a" | "b" | "c" | "d" | null;
		const input = value as Input;
		const isAB = (value: Input): value is "a" | "b" => value === "a" || value === "b";
		const isCD = (value: Input): value is "c" | "d" => value === "c" || value === "d";
		const direct = DCommon.and(input, [isAB, isCD]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, never, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const callback = vi.fn();
		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isCD, isAB]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, never, "strict">;

				callback(value);

				return 0 as const;
			}),
		);

		expect(direct).toBe(false);
		expect(curried).toBe(input);
		expect(callback).not.toHaveBeenCalled();
	});

	it.each([
		{
			input: "accepted" as string | number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: 1 as string | number | null,
			expected: true,
			transformed: "matched",
		},
		{
			input: "other" as string | number | null,
			expected: false,
			transformed: "other",
		},
		{
			input: 2 as string | number | null,
			expected: false,
			transformed: 2,
		},
		{
			input: null as string | number | null,
			expected: false,
			transformed: null,
		},
	])("refines broad input members with an output union for $input", ({ input, expected, transformed }) => {
		type Input = string | number | null;
		type Output = "accepted" | 1;
		const isStringOrOne = (value: Input): value is string | 1 => DCommon.isType(value, "string") || value === 1;
		const isAcceptedOrNumber = (value: Input): value is "accepted" | number => DCommon.isType(value, "number")
			|| value === "accepted";
		const direct = DCommon.and(input, [isStringOrOne, isAcceptedOrNumber]);

		if (direct) {
			type CheckInput = DCommon.ExpectType<typeof input, Output, "strict">;
		} else {
			type CheckInput = DCommon.ExpectType<typeof input, Input, "strict">;
		}

		const curried = DCommon.pipe(
			input,
			DCommon.when(DCommon.and([isAcceptedOrNumber, isStringOrOne]), (value) => {
				type CheckValue = DCommon.ExpectType<typeof value, Output, "strict">;

				return "matched" as const;
			}),
		);

		type CheckResult = DCommon.ExpectType<typeof curried, Input, "strict">;

		expect(direct).toBe(expected);
		expect(curried).toBe(transformed);
	});
});
