import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import { type Left } from "./left";
import { type Right } from "./right";
import { type GetValue, type GetInformation, type RequireInformationCombination } from "./types";
import type * as DObject from "@scripts/object";
import { informationKind, valueKind } from "./kind";

type ComputeCombination<
	GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[],
> = GenericCombination extends readonly [
	infer InferredFirst,
	...infer InferredRest extends readonly (Right | Left)[],
]
	? InferredFirst extends unknown
		? ComputeCombination<InferredRest> extends infer InferredResult extends readonly (Right | Left)[]
			? InferredResult extends unknown
				? readonly [InferredFirst, ...InferredResult]
				: never
			: never
		: never
	: readonly [];

type ComputeInformationCombination<
	GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[],
> = GenericCombination extends readonly [
	infer InferredFirst extends Right | Left,
	...infer InferredRest extends readonly (Right | Left)[],
]
	? ComputeInformationCombination<InferredRest> extends infer InferredResult extends string
		? DCommon.IsNever<InferredResult> extends true
			? GetInformation<InferredFirst>
			: `${GetInformation<InferredFirst>}/${InferredResult}`
		: never
	: never;

type ComputeEntry<
	GenericCombination extends DCommon.AnyTuple<Right | Left>,
> = ComputeCombination<
	GenericCombination
> extends infer InferredResult extends DCommon.AnyTuple<Right | Left>
	? InferredResult extends unknown
		? readonly [
			ComputeInformationCombination<InferredResult>,
			InferredResult,
		]
		: never
	: never;

type UnwrapCombination<
	GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[],
> = GenericCombination extends readonly [
	infer InferredFirst extends Right | Left,
	...infer InferredRest extends readonly (Right | Left)[],
]
	? readonly [GetValue<InferredFirst>, ...UnwrapCombination<InferredRest>]
	: readonly [];

type ComputeMatcher<
	GenericCombination extends DCommon.AnyTuple<Right | Left>,
> = ComputeEntry<
	GenericCombination
> extends infer InferredResult extends readonly [
	string,
	DCommon.AnyTuple<Right | Left>,
]
	? {
		[
		Entry in InferredResult as Entry[0]
		]: (combination: UnwrapCombination<Entry[1]>) => unknown
	}
	: never;

type ForbiddenMoreKey<
	GenericCombination extends DCommon.AnyTuple<Right | Left>,
	GenericMatcher extends ComputeMatcher<GenericCombination>,
> = DObject.ForbiddenKey<
	GenericMatcher,
	Extract<
		Exclude<
			keyof GenericMatcher,
			ComputeInformationCombination<GenericCombination>
		>,
		string
	>
>;

export function matchInformationCombination<
	const GenericCombination extends DCommon.AnyTuple<Right | Left>,
	GenericMatcher extends ComputeMatcher<GenericCombination>,
	GenericError extends ForbiddenMoreKey<GenericCombination, GenericMatcher>,
>(
	matcher: (
		& ComputeMatcher<NoInfer<GenericCombination>>
		& GenericMatcher
		& NoInfer<GenericError>
	),
): (
	combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>,
) => ReturnType<DObject.Values<NoInfer<GenericMatcher>>>;

export function matchInformationCombination<
	const GenericCombination extends DCommon.AnyTuple<Right | Left>,
	GenericMatcher extends ComputeMatcher<GenericCombination>,
>(
	combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>,
	matcher: DCommon.FixDeepFunctionInfer<
		ComputeMatcher<GenericCombination>,
		GenericMatcher
	>
	& ForbiddenMoreKey<GenericCombination, GenericMatcher>,
): ReturnType<DObject.Values<GenericMatcher>>;

export function matchInformationCombination(
	...args:
		| [combination: DCommon.AnyTuple<Right | Left>, matcher: object]
		| [matcher: object]
): any {
	if (args.length === 1) {
		const [matcher] = args;

		return (combination: DCommon.AnyTuple<Right | Left>) => matchInformationCombination(
			combination as never,
			matcher as never,
		);
	}

	const [combination, matcher] = args;
	const information = DString.join(
		DArray.map(combination, (either) => informationKind.getValue(either)),
		"/",
	);

	return (matcher[information as never] as DCommon.AnyFunction)(
		DArray.map(combination, (either) => valueKind.getValue(either)),
	);
}
