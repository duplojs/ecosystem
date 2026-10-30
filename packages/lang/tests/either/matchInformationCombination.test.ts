import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

type Combination = readonly [
	DEither.Success<42> | DEither.Error<"message">,
	DEither.Right<"found", 1> | DEither.Left<"missing", undefined>,
];

const cases = [
	{
		input: [DEither.success(42), DEither.right("found", 1)] as Combination,
		information: "success/found",
		expectedArgument: [42, 1],
		expected: 43,
	},
	{
		input: [DEither.success(42), DEither.left("missing")] as Combination,
		information: "success/missing",
		expectedArgument: [42, undefined],
		expected: "unavailable",
	},
	{
		input: [DEither.error("message"), DEither.right("found", 1)] as Combination,
		information: "error/found",
		expectedArgument: ["message", 1],
		expected: false,
	},
	{
		input: [DEither.error("message"), DEither.left("missing")] as Combination,
		information: "error/missing",
		expectedArgument: ["message", undefined],
		expected: undefined,
	},
];

describe("matchInformationCombination", () => {
	it.each(cases)("matches $information directly", ({ input, information, expectedArgument, expected }) => {
		const selected = vi.fn();
		const result = DEither.matchInformationCombination(input, {
			"success/found": (combination) => {
				type _CheckCombination = DCommon.ExpectType<
					typeof combination,
					readonly [42, 1],
					"strict"
				>;

				selected("success/found", combination);
				return 43;
			},
			"success/missing": (combination) => {
				type _CheckCombination = DCommon.ExpectType<
					typeof combination,
					readonly [42, undefined],
					"strict"
				>;

				selected("success/missing", combination);
				return "unavailable";
			},
			"error/found": (combination) => {
				type _CheckCombination = DCommon.ExpectType<
					typeof combination,
					readonly ["message", 1],
					"strict"
				>;

				selected("error/found", combination);
				return false as const;
			},
			"error/missing": (combination) => {
				type _CheckCombination = DCommon.ExpectType<
					typeof combination,
					readonly ["message", undefined],
					"strict"
				>;

				selected("error/missing", combination);
				return undefined;
			},
		});

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number | string | false | undefined,
			"strict"
		>;

		expect(result).toBe(expected);
		expect(selected).toHaveBeenCalledExactlyOnceWith(information, expectedArgument);
	});

	it.each(cases)("matches $information in a pipe", ({ input, information, expectedArgument, expected }) => {
		const selected = vi.fn();
		const result = DCommon.pipe(
			input,
			DEither.matchInformationCombination({
				"success/found": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly [42, 1],
						"strict"
					>;

					selected("success/found", combination);
					return 43;
				},
				"success/missing": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly [42, undefined],
						"strict"
					>;

					selected("success/missing", combination);
					return "unavailable";
				},
				"error/found": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly ["message", 1],
						"strict"
					>;

					selected("error/found", combination);
					return false as const;
				},
				"error/missing": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly ["message", undefined],
						"strict"
					>;

					selected("error/missing", combination);
					return undefined;
				},
			}),
		);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			number | string | false | undefined,
			"strict"
		>;

		expect(result).toBe(expected);
		expect(selected).toHaveBeenCalledExactlyOnceWith(information, expectedArgument);
	});

	it("matches a single either and preserves its payload type", () => {
		const result = DEither.matchInformationCombination([DEither.success(42)], {
			success: ([value]) => value,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, 42, "strict">;

		expect(result).toBe(42);
	});

	it("matches three ordered information values", () => {
		const result = DCommon.pipe(
			[DEither.right("user", { id: 1 }), DEither.left("pending"), DEither.success(true)] as const,
			DEither.matchInformationCombination({
				"user/pending/success": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly [{ readonly id: 1 }, undefined, true],
						"strict"
					>;

					return combination[0];
				},
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, { readonly id: 1 }, "strict">;

		expect(result).toStrictEqual({ id: 1 });
	});

	it("groups variants sharing the same information", () => {
		const input = [DEither.right("same", 1)] as readonly [
			DEither.Right<"same", 1> | DEither.Left<"same", 2>,
		];
		const result = DEither.matchInformationCombination(input, {
			same: (combination) => {
				type _CheckCombination = DCommon.ExpectType<
					typeof combination,
					readonly [1] | readonly [2],
					"strict"
				>;

				return combination[0];
			},
		});

		type _CheckResult = DCommon.ExpectType<typeof result, 1 | 2, "strict">;

		expect(result).toBe(1);
	});

	it("unwraps falsy payloads at every tuple position", () => {
		const result = DEither.matchInformationCombination(
			[
				DEither.right("undefined"),
				DEither.left("null", null),
				DEither.right("false", false),
				DEither.left("zero", 0),
				DEither.right("empty", ""),
			],
			{ "undefined/null/false/zero/empty": (values) => values },
		);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly [undefined, null, false, 0, ""], "strict">;

		expect(result).toStrictEqual([undefined, null, false, 0, ""]);
	});

	it("preserves payload references without mutating the input", () => {
		const first = { id: 1 };
		const second = { name: "Ada" };
		const firstEither = DEither.right("first", first);
		const secondEither = DEither.left("second", second);
		const input: [typeof firstEither, typeof secondEither] = [firstEither, secondEither];
		const result = DEither.matchInformationCombination(input, {
			"first/second": (values) => values,
		});

		type _CheckResult = DCommon.ExpectType<typeof result, readonly [typeof first, typeof second], "strict">;

		expect(result[0]).toBe(first);
		expect(result[1]).toBe(second);
		expect(input[0]).toBe(firstEither);
		expect(input[1]).toBe(secondEither);
	});

	it("requires exhaustive matchers and rejects unknown combinations", () => {
		const input = [DEither.success(42)] as readonly [DEither.Success<42> | DEither.Error<"message">];
		const matcher = {
			success: () => 1,
			error: () => 0,
		};
		const result = DEither.matchInformationCombination(input, matcher);
		const unknownMatcher = {
			...matcher,
			other: () => 2,
		};

		expect(result).toBe(1);

		if (false) {
			// @ts-expect-error matcher must handle every possible information
			DEither.matchInformationCombination(input, { success: () => 1 });

			// @ts-expect-error matcher cannot contain an unknown information
			DEither.matchInformationCombination(input, unknownMatcher);

			// @ts-expect-error an empty tuple is not a combination
			DEither.matchInformationCombination([], {});

			// @ts-expect-error every combination element must be an either
			DEither.matchInformationCombination([DEither.success(42), "plain"], {});

			// @ts-expect-error arrays of unknown length are not supported
			DEither.matchInformationCombination([] as DEither.Success<42>[], {});

			DCommon.pipe(
				input,
				// @ts-expect-error curried matcher must handle every possible information
				DEither.matchInformationCombination({ success: () => 1 }),
			);

			DCommon.pipe(
				input,
				// @ts-expect-error curried matcher cannot contain an unknown information
				DEither.matchInformationCombination(unknownMatcher),
			);
		}
	});

	it("requires a single finite input tuple", () => {
		const input = [DEither.success(42)] as const;
		const matcher = { success: () => 1 };
		const result = DEither.matchInformationCombination(input, matcher);

		expect(result).toBe(1);

		if (false) {
			const spread = input as readonly [DEither.Success<42>, ...DEither.Error<"message">[]];
			const union = input as readonly [DEither.Success<42>] | readonly [DEither.Error<"message">];
			const lengthUnion = input as (
				| readonly [DEither.Success<42>]
				| readonly [DEither.Success<42>, DEither.Error<"message">]
			);
			const unionMatcher = {
				success: () => 1,
				error: () => 0,
			};
			const lengthUnionMatcher = {
				success: () => 1,
				"success/error": () => 0,
			};

			// @ts-expect-error input must have a finite length
			DEither.matchInformationCombination(spread, matcher);
			// @ts-expect-error unions of tuples are forbidden
			DEither.matchInformationCombination(union, unionMatcher);
			// @ts-expect-error unions of tuple lengths are forbidden
			DEither.matchInformationCombination(lengthUnion, lengthUnionMatcher);

			DCommon.pipe(
				// @ts-expect-error curried input must have a finite length
				spread,
				DEither.matchInformationCombination(matcher),
			);
			DCommon.pipe(
				// @ts-expect-error curried input cannot be a union of tuples
				union,
				DEither.matchInformationCombination(unionMatcher),
			);
			DCommon.pipe(
				// @ts-expect-error curried input cannot be a union of tuple lengths
				lengthUnion,
				DEither.matchInformationCombination(lengthUnionMatcher),
			);
		}
	});
});
