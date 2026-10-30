import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";

type Combination = readonly [
	DEither.Success<42> | DEither.Error<"message">,
	DEither.Right<"found", 1> | DEither.Left<"missing", undefined>,
];

type RemainingCombination = (
	| readonly [DEither.Success<42>, DEither.Left<"missing", undefined>]
	| readonly [DEither.Error<"message">, DEither.Right<"found", 1>]
);

type ExpandedCombination = (
	| readonly [DEither.Success<42>, DEither.Right<"found", 1>]
	| readonly [DEither.Error<"message">, DEither.Left<"missing", undefined>]
	| RemainingCombination
);

const successFoundInput = [DEither.success(42), DEither.right("found", 1)] as Combination;
const successMissingInput = [DEither.success(42), DEither.left("missing")] as Combination;
const errorFoundInput = [DEither.error("message"), DEither.right("found", 1)] as Combination;
const errorMissingInput = [DEither.error("message"), DEither.left("missing")] as Combination;

const cases = [
	{
		input: successFoundInput,
		information: "success/found",
		expectedArgument: [42, 1],
		expected: 42,
	},
	{
		input: successMissingInput,
		information: "otherwise",
		expectedArgument: successMissingInput,
		expected: "otherwise",
	},
	{
		input: errorFoundInput,
		information: "otherwise",
		expectedArgument: errorFoundInput,
		expected: "otherwise",
	},
	{
		input: errorMissingInput,
		information: "error/missing",
		expectedArgument: ["message", undefined],
		expected: false,
	},
];

describe("matchInformationCombinationOtherwise", () => {
	it.each(cases)("matches $information directly", ({ input, information, expectedArgument, expected }) => {
		const selected = vi.fn();
		const result = DEither.matchInformationCombinationOtherwise(
			input,
			{
				"success/found": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly [42, 1],
						"strict"
					>;

					selected("success/found", combination);
					return combination[0];
				},
				"error/missing": (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly ["message", undefined],
						"strict"
					>;

					selected("error/missing", combination);
					return false as const;
				},
			},
			(combination) => {
				type _CheckCombination = DCommon.ExpectType<typeof combination, RemainingCombination, "strict">;

				selected("otherwise", combination);
				return "otherwise" as const;
			},
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 42 | false | "otherwise", "strict">;

		expect(result).toBe(expected);
		expect(selected).toHaveBeenCalledExactlyOnceWith(information, expectedArgument);
	});

	it.each(cases)("matches $information in a pipe", ({ input, information, expectedArgument, expected }) => {
		const selected = vi.fn();
		const result = DCommon.pipe(
			input,
			DEither.matchInformationCombinationOtherwise(
				{
					"success/found": (combination) => {
						type _CheckCombination = DCommon.ExpectType<
							typeof combination,
							readonly [42, 1],
							"strict"
						>;

						selected("success/found", combination);
						return combination[0];
					},
					"error/missing": (combination) => {
						type _CheckCombination = DCommon.ExpectType<
							typeof combination,
							readonly ["message", undefined],
							"strict"
						>;

						selected("error/missing", combination);
						return false as const;
					},
				},
				(combination) => {
					type _CheckCombination = DCommon.ExpectType<typeof combination, RemainingCombination, "strict">;

					selected("otherwise", combination);
					return "otherwise" as const;
				},
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 42 | false | "otherwise", "strict">;

		expect(result).toBe(expected);
		expect(selected).toHaveBeenCalledExactlyOnceWith(information, expectedArgument);
	});

	it("passes every combination to otherwise when the matcher is empty", () => {
		const input = [DEither.success(42), DEither.right("found", 1)] as Combination;
		const result = DEither.matchInformationCombinationOtherwise(input, {}, (combination) => {
			type _CheckCombination = DCommon.ExpectType<typeof combination, ExpandedCombination, "strict">;

			return combination;
		});

		type _CheckResult = DCommon.ExpectType<typeof result, ExpandedCombination, "strict">;

		expect(result).toBe(input);
	});

	it("preserves every combination with an empty matcher in a pipe", () => {
		const input = [DEither.error("message"), DEither.left("missing")] as Combination;
		const result = DCommon.pipe(
			input,
			DEither.matchInformationCombinationOtherwise({}, (combination) => {
				type _CheckCombination = DCommon.ExpectType<typeof combination, ExpandedCombination, "strict">;

				return combination;
			}),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, ExpandedCombination, "strict">;

		expect(result).toBe(input);
	});

	it("narrows otherwise to never when every combination is handled", () => {
		const input = [DEither.success(42)] as readonly [DEither.Success<42> | DEither.Error<"message">];
		const otherwise = vi.fn();
		const result = DEither.matchInformationCombinationOtherwise(
			input,
			{
				success: ([value]) => value,
				error: ([value]) => value,
			},
			(combination) => {
				type _CheckCombination = DCommon.ExpectType<typeof combination, never, "strict">;

				otherwise(combination);
				return combination;
			},
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 42 | "message", "strict">;

		expect(result).toBe(42);
		expect(otherwise).not.toHaveBeenCalled();
	});

	it("groups variants sharing the same information", () => {
		const input = [DEither.left("same", 2)] as readonly [
			DEither.Right<"same", 1> | DEither.Left<"same", 2> | DEither.Error<"message">,
		];
		const result = DEither.matchInformationCombinationOtherwise(
			input,
			{
				same: (combination) => {
					type _CheckCombination = DCommon.ExpectType<
						typeof combination,
						readonly [1] | readonly [2],
						"strict"
					>;

					return combination[0];
				},
			},
			(combination) => {
				type _CheckCombination = DCommon.ExpectType<typeof combination, readonly [DEither.Error<"message">], "strict">;

				return DEither.unwrapLeft(combination[0]);
			},
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 1 | 2 | "message", "strict">;

		expect(result).toBe(2);
	});

	it("matches three ordered information values", () => {
		const input = [DEither.right("user", 1), DEither.left("pending"), DEither.success(true)] as const;
		const result = DEither.matchInformationCombinationOtherwise(
			input,
			{ "user/pending/success": ([value]) => value },
			(combination) => {
				type _CheckCombination = DCommon.ExpectType<typeof combination, never, "strict">;

				return combination;
			},
		);

		type _CheckResult = DCommon.ExpectType<typeof result, 1, "strict">;

		expect(result).toBe(1);
	});

	it("unwraps falsy payloads in a pipe", () => {
		const result = DCommon.pipe(
			[
				DEither.right("undefined"),
				DEither.left("null", null),
				DEither.right("false", false),
				DEither.left("zero", 0),
				DEither.right("empty", ""),
			] as const,
			DEither.matchInformationCombinationOtherwise(
				{ "undefined/null/false/zero/empty": (values) => values },
				(combination) => combination,
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly [undefined, null, false, 0, ""], "strict">;

		expect(result).toStrictEqual([undefined, null, false, 0, ""]);
	});

	it("preserves payload references without mutating the input in a pipe", () => {
		const first = { id: 1 };
		const second = { name: "Ada" };
		const firstEither = DEither.right("first", first);
		const secondEither = DEither.left("second", second);
		const input: [typeof firstEither, typeof secondEither] = [firstEither, secondEither];
		const result = DCommon.pipe(
			input,
			DEither.matchInformationCombinationOtherwise(
				{ "first/second": (values) => values },
				(combination) => combination,
			),
		);

		type _CheckResult = DCommon.ExpectType<typeof result, readonly [typeof first, typeof second], "strict">;

		expect(result[0]).toBe(first);
		expect(result[1]).toBe(second);
		expect(input[0]).toBe(firstEither);
		expect(input[1]).toBe(secondEither);
	});

	it.each([
		{ value: undefined },
		{ value: null },
		{ value: false },
		{ value: 0 },
		{ value: "" },
	])("preserves a matched falsy result $value", ({ value }) => {
		const otherwise = vi.fn(() => "otherwise");
		const result = DEither.matchInformationCombinationOtherwise(
			[DEither.success(42)],
			{ success: () => value },
			otherwise,
		);

		expect(result).toBe(value);
		expect(otherwise).not.toHaveBeenCalled();
	});

	it("rejects unknown keys, undefined callbacks and invalid inputs", () => {
		const input = [DEither.success(42)] as const;
		const otherwise = () => 0;
		const unknownMatcher = {
			success: () => 42,
			other: () => 1,
		};
		const result = DEither.matchInformationCombinationOtherwise(input, {}, otherwise);

		expect(result).toBe(0);

		if (false) {
			// @ts-expect-error matcher cannot contain unknown information
			DEither.matchInformationCombinationOtherwise(input, unknownMatcher, otherwise);

			// @ts-expect-error callbacks cannot be undefined
			DEither.matchInformationCombinationOtherwise(input, { success: undefined }, otherwise);

			// @ts-expect-error the input must be a nonempty tuple
			DEither.matchInformationCombinationOtherwise([], {}, otherwise);

			// @ts-expect-error every input element must be an either
			DEither.matchInformationCombinationOtherwise(["plain"], {}, otherwise);

			DCommon.pipe(
				input,
				// @ts-expect-error curried matcher cannot contain unknown information
				DEither.matchInformationCombinationOtherwise(unknownMatcher, otherwise),
			);

			DCommon.pipe(
				input,
				// @ts-expect-error curried callbacks cannot be undefined
				DEither.matchInformationCombinationOtherwise({ success: undefined }, otherwise),
			);

			DCommon.pipe(
				// @ts-expect-error curried input must be a nonempty tuple
				[] as const,
				DEither.matchInformationCombinationOtherwise({}, otherwise),
			);

			DCommon.pipe(
				// @ts-expect-error curried input elements must be eithers
				["plain"] as const,
				DEither.matchInformationCombinationOtherwise({}, otherwise),
			);
		}
	});

	it("requires a single finite input tuple", () => {
		const input = [DEither.success(42)] as const;
		const otherwise = () => 0;
		const result = DEither.matchInformationCombinationOtherwise(input, {}, otherwise);

		expect(result).toBe(0);

		if (false) {
			const spread = input as readonly [DEither.Success<42>, ...DEither.Error<"message">[]];
			const union = input as readonly [DEither.Success<42>] | readonly [DEither.Error<"message">];
			const lengthUnion = input as (
				| readonly [DEither.Success<42>]
				| readonly [DEither.Success<42>, DEither.Error<"message">]
			);

			// @ts-expect-error input must have a finite length
			DEither.matchInformationCombinationOtherwise(spread, {}, otherwise);
			// @ts-expect-error unions of tuples are forbidden
			DEither.matchInformationCombinationOtherwise(union, {}, otherwise);
			// @ts-expect-error unions of tuple lengths are forbidden
			DEither.matchInformationCombinationOtherwise(lengthUnion, {}, otherwise);

			DCommon.pipe(
				// @ts-expect-error curried input must have a finite length
				spread,
				DEither.matchInformationCombinationOtherwise({}, otherwise),
			);
			DCommon.pipe(
				// @ts-expect-error curried input cannot be a union of tuples
				union,
				DEither.matchInformationCombinationOtherwise({}, otherwise),
			);
			DCommon.pipe(
				// @ts-expect-error curried input cannot be a union of tuple lengths
				lengthUnion,
				DEither.matchInformationCombinationOtherwise({}, otherwise),
			);
		}
	});
});
