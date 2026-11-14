import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number/types";
import type * as DObject from "@scripts/object";

type ComputeMatcher<
	GenericInput extends number,
> = DCommon.SimplifyType<{
	[Prop in GenericInput]?: (value: Prop) => unknown
}>;

type ForbiddenMoreKey<
	GenericInput extends number,
	GenericMatcher extends object,
> = Exclude<keyof GenericMatcher, GenericInput> extends infer InferredKey
	? DCommon.IsEqual<InferredKey, never> extends true
		? unknown
		: DCommon.ComputedTypeError<`Key "${Extract<InferredKey, number>}" is forbidden.`>
	: never;

type HandledKeys<GenericMatcher extends object> = Extract<
	DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction>,
	number
>;

export function matchWithNumberOtherwise<
	GenericInput extends number,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>,
	GenericMatcher extends object,
	GenericOutput extends unknown,
>(
	matcher: (
		& NoInfer<ComputeMatcher<GenericClearInput>>
		& GenericMatcher
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
		& DObject.ForbiddenUndefinedProps<GenericMatcher>
	),
	otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput,
): (
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>,
) => (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithNumberOtherwise<
	GenericInput extends number,
	GenericClearInput extends Extract<DCommon.RemoveConstraint<GenericInput>, number>,
	GenericMatcher extends object,
	GenericOutput extends unknown,
>(
	input: GenericInput & DNumber.RequireSimpleLiteral<GenericClearInput>,
	matcher: (
		& NoInfer<ComputeMatcher<GenericClearInput>>
		& GenericMatcher
		& ForbiddenMoreKey<GenericClearInput, GenericMatcher>
		& DObject.ForbiddenUndefinedProps<GenericMatcher>
	),
	otherwise: (value: DCommon.BreakGenericLink<Exclude<GenericInput, HandledKeys<GenericMatcher>>>) => GenericOutput,
): (
	| ReturnType<Extract<GenericMatcher[keyof GenericMatcher], DCommon.AnyFunction>>
	| GenericOutput
);

export function matchWithNumberOtherwise(
	...args:
		| [
			matcher: Record<number, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
		| [
			input: number,
			matcher: Record<number, DCommon.AnyFunction | undefined>,
			otherwise: DCommon.AnyFunction,
		]
): unknown {
	if (args.length === 2) {
		const [matcher, otherwise] = args;
		return (input: number) => matchWithNumberOtherwise(
			input as never,
			matcher as never,
			otherwise as never,
		);
	}

	const [input, matcher, otherwise] = args;
	return matcher[input] === undefined
		? otherwise(input)
		: matcher[input](input);
}
