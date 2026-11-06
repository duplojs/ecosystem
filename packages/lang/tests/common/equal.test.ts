import * as DCommon from "@scripts/common";

describe("equal", () => {
	it("compares primitive values directly", () => {
		expect(DCommon.equal("value", "value")).toBe(true);
		expect(DCommon.equal("other" as "other" | "value", "value")).toBe(false);
		expect(DCommon.equal(1, 1)).toBe(true);
		expect(DCommon.equal(2 as 1 | 2, 1)).toBe(false);
		expect(DCommon.equal(1n, 1n)).toBe(true);
		expect(DCommon.equal(2n as 1n | 2n, 1n)).toBe(false);
		expect(DCommon.equal(true, true)).toBe(true);
		expect(DCommon.equal(false as boolean, true)).toBe(false);
		expect(DCommon.equal(null, null)).toBe(true);
		expect(DCommon.equal(undefined, undefined)).toBe(true);
		expect(DCommon.equal(null as null | undefined, undefined)).toBe(false);
		expect(DCommon.equal(undefined as null | undefined, null)).toBe(false);
	});

	it("does not coerce compared values", () => {
		expect(DCommon.equal("1" as string | number, 1)).toBe(false);
		expect(DCommon.equal(1 as number | bigint, 1n)).toBe(false);
		expect(DCommon.equal(0 as number | boolean, false)).toBe(false);
		expect(DCommon.equal("" as string | boolean, false)).toBe(false);
		expect(DCommon.equal({} as object | string, "[object Object]")).toBe(false);
		expect(DCommon.equal([] as readonly string[] | string, "")).toBe(false);
	});

	it("compares symbols by identity", () => {
		const token = Symbol("token");
		const other = Symbol("token");

		expect(DCommon.equal(token, token)).toBe(true);
		expect(DCommon.equal(token as symbol, other)).toBe(false);
		expect(DCommon.equal(token as typeof token | typeof other, [other, token])).toBe(true);
		expect(DCommon.equal(token as symbol, [other])).toBe(false);
	});

	it("checks membership in a comparison list", () => {
		expect(DCommon.equal("a" as "a" | "b", ["a", "b"])).toBe(true);
		expect(DCommon.equal("b" as "a" | "b", ["a", "b"])).toBe(true);
		expect(DCommon.equal("c" as "a" | "b" | "c", ["a", "b"])).toBe(false);
		expect(DCommon.equal(1 as "a" | 1 | null, ["a", 1, null])).toBe(true);
		expect(DCommon.equal(1 as number | string | bigint | boolean, ["1", 1n, true])).toBe(false);
		expect(DCommon.equal(null as null | undefined, [null, undefined])).toBe(true);
		expect(DCommon.equal(undefined as null | undefined, [null, undefined])).toBe(true);
		expect(DCommon.equal("a", [])).toBe(false);
		expect(DCommon.equal(undefined, [])).toBe(false);
	});

	it("supports readonly literal tuples", () => {
		const values = ["a", "b"] as const;
		const direct = DCommon.equal("b" as "a" | "b", values);
		const curried = DCommon.pipe("c" as "a" | "b" | "c", DCommon.equal(values));

		expect(direct).toBe(true);
		expect(curried).toBe(false);
		expect(values).toStrictEqual(["a", "b"]);
	});

	it("uses strict equality for scalars and SameValueZero for list membership", () => {
		expect(DCommon.equal(0, -0)).toBe(true);
		expect(DCommon.equal(NaN, NaN)).toBe(false);
		expect(DCommon.equal(0, [-0])).toBe(true);
		expect(DCommon.equal(NaN, [NaN])).toBe(true);
	});

	it("compares scalar values in a pipe", () => {
		const matching = DCommon.pipe("a", DCommon.equal("a"));
		const different = DCommon.pipe("b" as "a" | "b", DCommon.equal("a"));
		const undefinedValue = DCommon.pipe(undefined, DCommon.equal(undefined));

		type _CheckResult = DCommon.ExpectType<typeof matching, boolean, "strict">;

		expect(matching).toBe(true);
		expect(different).toBe(false);
		expect(undefinedValue).toBe(true);
	});

	it("compares lists in a pipe", () => {
		const matching = DCommon.pipe("b" as "a" | "b", DCommon.equal(["a", "b"]));
		const different = DCommon.pipe("c" as "a" | "b" | "c", DCommon.equal(["a", "b"]));
		const empty = DCommon.pipe("a", DCommon.equal<string>([]));

		type _CheckResult = DCommon.ExpectType<typeof matching, boolean, "strict">;

		expect(matching).toBe(true);
		expect(different).toBe(false);
		expect(empty).toBe(false);
	});

	it.each([
		{
			input: "a" as "a" | "b" | null,
			expected: true,
		},
		{
			input: "b" as "a" | "b" | null,
			expected: false,
		},
		{
			input: null as "a" | "b" | null,
			expected: false,
		},
	])("narrows both scalar predicate branches for $input", ({ input, expected }) => {
		const result = DCommon.equal(input, "a");

		if (DCommon.equal(input, "a")) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a", "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "b" | null, "strict">;
		}

		expect(result).toBe(expected);
	});

	it.each([
		{
			input: "a" as "a" | "b" | null,
			expected: true,
		},
		{
			input: "b" as "a" | "b" | null,
			expected: false,
		},
		{
			input: null as "a" | "b" | null,
			expected: true,
		},
	])("narrows both tuple predicate branches for $input", ({ input, expected }) => {
		const result = DCommon.equal(input, ["a", null]);

		if (DCommon.equal(input, ["a", null])) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | null, "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "b", "strict">;
		}

		expect(result).toBe(expected);
	});

	it("narrows a mixed literal union", () => {
		const token = Symbol("token");
		const input = 1 as "a" | 1 | 1n | boolean | typeof token | null | undefined;

		if (DCommon.equal(input, [1, 1n, true, token, null, undefined])) {
			type _CheckInput = DCommon.ExpectType<
				typeof input,
				1 | 1n | true | typeof token | null | undefined,
				"strict"
			>;

			expect(input).toBe(1);
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | false, "strict">;
		}
	});

	it("preserves object inputs in the negative branch", () => {
		const input = { value: "a" } as "a" | { value: string };

		if (DCommon.equal(input, "a")) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a", "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, { value: string }, "strict">;

			expect(input).toStrictEqual({ value: "a" });
		}
	});

	it("uses the boolean overload for an empty comparison tuple", () => {
		const input = "a" as "a" | "b";

		if (DCommon.equal(input, [])) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b", "strict">;

			expect.unreachable("an empty list cannot match");
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b", "strict">;

			expect(input).toBe("a");
		}
	});

	it("preserves a scalar predicate in a pipe", () => {
		const result = DCommon.pipe(
			"a" as "a" | "b" | null,
			DCommon.when(DCommon.equal("a"), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a", "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 0 | "b" | null, "strict">;

		expect(result).toBe(0);
	});

	it("preserves a tuple predicate in a pipe", () => {
		const result = DCommon.pipe(
			null as "a" | "b" | null,
			DCommon.when(DCommon.equal(["a", null]), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a" | null, "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 0 | "b", "strict">;

		expect(result).toBe(0);
	});

	it("preserves unmatched values in a pipe", () => {
		const result = DCommon.pipe(
			"b" as "a" | "b" | null,
			DCommon.when(DCommon.equal(["a", null]), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a" | null, "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 0 | "b", "strict">;

		expect(result).toBe("b");
	});

	it("preserves the input type for an empty comparison tuple in a pipe", () => {
		const input = "a" as "a" | "b";
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.equal<typeof input>([]), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a" | "b", "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, "a" | "b" | 0, "strict">;

		expect(result).toBe("a");
	});

	it("returns a boolean for a broad comparison value", () => {
		const input = "a" as string | null;
		const value = "b" as string;
		const result = DCommon.equal(input, value);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		if (DCommon.equal(input, value)) {
			type _CheckInput = DCommon.ExpectType<typeof input, string | null, "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, string | null, "strict">;
		}

		expect(result).toBe(false);
	});

	it("returns a boolean for a comparison array with unknown length", () => {
		const input = "a" as "a" | "b" | null;
		const values: ("a" | "b")[] = ["b"];
		const result = DCommon.equal(input, values);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		if (DCommon.equal(input, values)) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | null, "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | null, "strict">;
		}

		expect(result).toBe(false);
	});

	it("returns a boolean for a union inside a comparison tuple", () => {
		const input = "a" as "a" | "b" | null;
		const values: ["a" | "b"] = ["b"];
		const result = DCommon.equal(input, values);

		type _CheckResult = DCommon.ExpectType<typeof result, boolean, "strict">;

		if (DCommon.equal(input, values)) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | null, "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | null, "strict">;
		}

		expect(result).toBe(false);
	});

	it("preserves input types for a broad comparison value in a pipe", () => {
		const input = "a" as string | null;
		const compared = "b" as string;
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.equal<typeof input>(compared), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, string | null, "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, string | null | 0, "strict">;

		expect(result).toBe("a");
	});

	it("preserves input types for a union inside a tuple in a pipe", () => {
		const input = "a" as "a" | "b" | null;
		const values: ["a" | "b"] = ["a"];
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.equal<typeof input>(values), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a" | "b" | null, "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, "a" | "b" | null | 0, "strict">;

		expect(result).toBe(0);
	});

	it("accepts explicit input and scalar comparison generics", () => {
		const input = "a" as "a" | "b";

		if (DCommon.equal<typeof input, "a">(input, "a")) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a", "strict">;

			expect(input).toBe("a");
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "b", "strict">;
		}
	});

	it("accepts explicit input and tuple comparison generics in a pipe", () => {
		const input = "a" as "a" | "b" | null;
		const result = DCommon.pipe(
			input,
			DCommon.when(DCommon.equal<typeof input, readonly ["a", null]>(["a", null]), (value) => {
				type _CheckValue = DCommon.ExpectType<typeof value, "a" | null, "strict">;

				return 0 as const;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 0 | "b", "strict">;

		expect(result).toBe(0);
	});

	it("selects the boolean overload when only the input generic is provided", () => {
		const input = "a" as "a" | "b";
		const direct = DCommon.equal<typeof input>(input, "a");
		const curried = DCommon.pipe(input, DCommon.equal<typeof input>("a"));

		type _CheckDirect = DCommon.ExpectType<typeof direct, boolean, "strict">;
		type _CheckCurried = DCommon.ExpectType<typeof curried, boolean, "strict">;

		if (DCommon.equal<typeof input>(input, "a")) {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b", "strict">;
		} else {
			type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b", "strict">;
		}

		expect(direct).toBe(true);
		expect(curried).toBe(true);
	});

	it("rejects explicit predicate generics for union comparison values", () => {
		const input = "a" as "a" | "b" | null;
		const value = "b" as "a" | "b";

		// @ts-expect-error a union comparison value cannot select the predicate overload
		DCommon.equal<typeof input, typeof value>(input, value);
		// @ts-expect-error the curried predicate overload rejects the same union
		DCommon.equal<typeof input, typeof value>(value);
	});

	it("rejects predicate overloads when the computed result is never", () => {
		const input = "a" as "a" | "b";

		// @ts-expect-error an empty comparison tuple computes a never predicate result
		DCommon.equal<typeof input, readonly []>(input, []);
		// @ts-expect-error the curried predicate overload rejects the same never result
		DCommon.equal<typeof input, readonly []>([]);
	});

	describe("predicate soundness", () => {
		it("keeps possible string values in the else branch after a scalar union comparison", () => {
			const input = "a" as "a" | "b" | number;
			const compared = "b" as "a" | "b";

			if (DCommon.equal(input, compared)) {
				type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | number, "strict">;

				expect.unreachable("a and b are different values");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | number, "strict">;

				expect(input).toBe("a");
			}
		});

		it("keeps possible string values in the else branch after a tuple union comparison", () => {
			const input = "a" as "a" | "b" | number;
			const compared = ["b"] as ["a"] | ["b"];

			if (DCommon.equal(input, compared)) {
				type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | number, "strict">;

				expect.unreachable("the comparison list contains only b");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, "a" | "b" | number, "strict">;

				expect(input).toBe("a");
			}
		});

		it("keeps possible booleans in the else branch after a boolean comparison", () => {
			const input = true as boolean | string;
			const compared = false as boolean;

			if (DCommon.equal(input, compared)) {
				type _CheckInput = DCommon.ExpectType<typeof input, boolean | string, "strict">;

				expect.unreachable("true and false are different values");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, boolean | string, "strict">;

				expect(input).toBe(true);
			}
		});

		it("keeps possible template strings in the else branch", () => {
			const input = "id-1" as `id-${number}` | number;
			const compared = "id-2" as `id-${number}`;

			if (DCommon.equal(input, compared)) {
				type _CheckInput = DCommon.ExpectType<typeof input, `id-${number}` | number, "strict">;

				expect.unreachable("id-1 and id-2 are different values");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, `id-${number}` | number, "strict">;

				expect(input).toBe("id-1");
			}
		});

		it("keeps a matching literal reachable when the input has a broad primitive type", () => {
			const input = "a" as string | number;

			if (DCommon.equal(input, "a")) {
				type _CheckInput = DCommon.ExpectType<typeof input, "a", "strict">;

				expect(input).toBe("a");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, string | number, "strict">;

				expect.unreachable("the input is equal to a");
			}
		});

		it("keeps unmatched values in the result type of a pipe", () => {
			const input = "a" as "a" | "b" | number;
			const compared = "b" as "a" | "b";
			const result = DCommon.pipe(
				input,
				DCommon.when(DCommon.equal<typeof input>(compared), (value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, "a" | "b" | number, "strict">;

					return 0 as const;
				}),
			);

			type _CheckResult = DCommon.ExpectType<typeof result, "a" | "b" | number, "strict">;

			expect(result).toBe("a");
		});

		it("narrows a broad primitive input to a literal in a pipe", () => {
			const result = DCommon.pipe(
				"a" as string | number,
				DCommon.when(DCommon.equal("a"), (value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, "a", "strict">;

					return 0 as const;
				}),
			);

			type _CheckResult = DCommon.ExpectType<typeof result, string | number, "strict">;

			expect(result).toBe(0);
		});

		it("excludes objects from the matching type of a broad primitive union", () => {
			const input = "a" as string | object;

			if (DCommon.equal(input, "a")) {
				type _CheckInput = DCommon.ExpectType<typeof input, "a", "strict">;

				expect(input).toBe("a");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, string | object, "strict">;

				expect.unreachable("the input is equal to a");
			}
		});

		it("excludes objects from the matching callback type in a pipe", () => {
			const result = DCommon.pipe(
				"a" as string | object,
				DCommon.when(DCommon.equal("a"), (value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, "a", "strict">;

					return 0 as const;
				}),
			);

			type _CheckResult = DCommon.ExpectType<typeof result, string | object | 0, "strict">;

			expect(result).toBe(0);
		});

		it("retains every matching member when the input mixes a broad primitive and a literal", () => {
			const input = "a" as string | 1;

			if (DCommon.equal(input, ["a", 1])) {
				type _CheckInput = DCommon.ExpectType<typeof input, "a" | 1, "strict">;

				expect(input).toBe("a");
			} else {
				type _CheckInput = DCommon.ExpectType<typeof input, string, "strict">;

				expect.unreachable("the comparison list contains a");
			}
		});

		it("retains every matching member of a mixed input in a pipe", () => {
			const result = DCommon.pipe(
				"a" as string | 1,
				DCommon.when(DCommon.equal(["a", 1]), (value) => {
					type _CheckValue = DCommon.ExpectType<typeof value, "a" | 1, "strict">;

					return value;
				}),
			);

			type _CheckResult = DCommon.ExpectType<typeof result, string | 1, "strict">;

			expect(result).toBe("a");
		});
	});

	it("rejects null comparisons when the input only contains strings and numbers", () => {
		const input = 1 as string | number;

		// @ts-expect-error null is not a possible input value
		DCommon.equal(input, null);
		// @ts-expect-error the explicit boolean overload requires a possible input value
		DCommon.equal<typeof input>(input, null);
		// @ts-expect-error the curried overload requires a possible input value
		DCommon.equal<typeof input>(null);
	});

	it("rejects literals absent from a literal input", () => {
		const input = "c" as const;

		// @ts-expect-error a is not a possible input value
		DCommon.equal(input, "a");
		// @ts-expect-error neither a nor b is a possible input value
		DCommon.equal(input, ["a", "b"]);
		// @ts-expect-error explicit generics must reject the same incompatible literals
		DCommon.equal<typeof input>(input, ["a", "b"]);
		// @ts-expect-error a curried comparison must reject the same incompatible literals
		DCommon.pipe(input, DCommon.equal(["a", "b"]));
		// @ts-expect-error 1 is not a possible value for an input of type 2
		DCommon.equal(2, 1);
		// @ts-expect-error true is not a possible value for an input of type false
		DCommon.equal(false, true);
	});

	it("rejects explicit predicate generics for template comparison values", () => {
		const input = "id-1" as `id-${number}` | number;
		const compared = "id-2" as `id-${number}`;

		// @ts-expect-error a template string comparison cannot select the predicate overload
		DCommon.equal<typeof input, typeof compared>(input, compared);
		// @ts-expect-error the curried predicate overload rejects the same template type
		DCommon.equal<typeof input, typeof compared>(compared);
	});

	it("rejects comparisons outside the declared parameter types", () => {
		// @ts-expect-error objects are not eligible comparison values
		DCommon.equal("a", {});
		// @ts-expect-error comparison lists contain only eligible primitives
		DCommon.equal([{}]);
		// @ts-expect-error explicit predicate generics require a literal comparison value
		DCommon.equal<"a" | "b", string>("a", "a");
		// @ts-expect-error explicit predicate generics require a tuple with known contents
		DCommon.equal<"a" | "b", "a"[]>(["a"]);
	});
});
