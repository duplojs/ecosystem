import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type * as DTuple from "@scripts/tuple";
import type { EligiblePrimitiveMatch, PatternValueMaybeAll } from "..";

export type GetIncompleteUnion<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	| (
		[
			Extract<GenericInput, EligiblePrimitiveMatch>,
			Extract<GenericPatternValue, EligiblePrimitiveMatch>,
		] extends [
			infer InferredInput,
			infer InferredPatternValue,
		]
			? DCommon.IsEqual<InferredPatternValue, never> extends true
				? never
				: DCommon.IsEqual<Exclude<InferredInput, InferredPatternValue>, never> extends true
					? {}
					: true
			: never
	)
	| (
		[
			Exclude<Extract<GenericInput, object>, GenericPatternValue | readonly any[]>,
			Exclude<Extract<GenericPatternValue, object>, readonly any[]>,
		] extends [
			infer InferredInput,
			infer InferredPatternValue,
		]
			? DCommon.IsEqual<InferredPatternValue, never> extends true
				? never
				: DCommon.IsEqual<
					InferredInput,
					Exclude<Extract<GenericInput, object>, readonly any[]>
				> extends true
					? DObject.FlatObject<{
						[Prop in (InferredPatternValue extends any ? keyof InferredPatternValue : never)]:
						GetIncompleteUnion<
							InferredInput[Extract<Prop, keyof InferredInput>],
							Extract<InferredPatternValue, { [SubProp in Prop]: any }>[Prop]
						>
					}>
					: DCommon.IsEqual<InferredInput, never> extends true
						? {}
						: {
							"@duplojs/lang/{object}": true;
						}
			: never
	)
	| (
		[
			DTuple.Unmatched<
				Extract<GenericInput, DCommon.AnyTuple>,
				Extract<GenericPatternValue, readonly any[]>
			>,
			Extract<GenericPatternValue, DCommon.AnyTuple | readonly []>,
		] extends [
			infer InferredInput,
			infer InferredPatternValue,
		]
			? DCommon.IsEqual<InferredPatternValue, never> extends true
				? never
				: DCommon.IsEqual<
					InferredInput,
					Extract<GenericInput, DCommon.AnyTuple>
				> extends true
					? [
						InferredInput,
						InferredPatternValue,
					] extends [
						readonly [infer InferredInputFirst, ...infer InferredInputRest],
						readonly [infer InferredPatternValueFirst, ...infer InferredPatternValueRest],
					]
						? GetIncompleteUnion<
							InferredInputFirst,
							InferredPatternValueFirst
						> extends infer InferredResultFirst
							? DObject.FlatObject<{
								"@duplojs/lang/[tuple.first": InferredResultFirst;
								"@duplojs/lang/tuple.rest]": GetIncompleteUnion<
									InferredInputRest,
									InferredPatternValueRest
								>;
							}>
							: never
						: never
					: DCommon.IsEqual<InferredInput, never> extends true
						? {}
						: {
							"@duplojs/lang/[tuple]": true;
						}
			: never
	)
	| (
		[
			Exclude<Extract<GenericInput, readonly any[]>, DCommon.AnyTuple>,
			Extract<GenericPatternValue, DCommon.AnyTuple>,
		] extends [
			infer InferredInput extends readonly any[],
			infer InferredPatternValue,
		]
			? DCommon.Or<[
				DCommon.IsEqual<InferredPatternValue, never>,
				DCommon.IsEqual<InferredInput, never>,
			]> extends true
				? never
				: InferredPatternValue extends readonly [
					infer InferredPatternValueFirst,
					...infer InferredPatternValueRest,
				]
					? GetIncompleteUnion<
						InferredInput[number],
						InferredPatternValueFirst
					> extends infer InferredResultFirst
						? DObject.FlatObject<{
							"@duplojs/lang/[array.first": InferredResultFirst;
							"@duplojs/lang/array.rest]": DCommon.IsEqual<InferredResultFirst, {}> extends true
								? GetIncompleteUnion<
									InferredInput,
									InferredPatternValueRest
								>
								: never;
						}>
						: {}
					: {}
			: never
	)
	| (
		[
			Exclude<Extract<GenericInput, readonly any[]>, DCommon.AnyTuple>,
			Exclude<Extract<GenericPatternValue, readonly any[]>, DCommon.AnyTuple>,
		] extends [
			infer InferredInput extends readonly any[],
			infer InferredPatternValue extends readonly any[],
		]
			? DCommon.Or<[
				DCommon.IsEqual<InferredPatternValue, never>,
				DCommon.IsEqual<InferredInput, never>,
			]> extends true
				? never
				: DCommon.IsEqual<
					Exclude<
						InferredInput[number],
						InferredPatternValue[number]
					>,
					never
				> extends true
					? {}
					: { "@duplojs/lang/[array]": true }
			: never
	)
	| (
		Extract<
			GenericPatternValue,
			PatternValueMaybeAll
		> extends infer InferredPatternValue
			? DCommon.IsEqual<InferredPatternValue, never> extends true
				? never
				: { "@duplojs/lang/{maybeAll}": true }
			: never
	)
	| (
		[
			Extract<GenericInput, readonly any[]>,
			Extract<GenericPatternValue, readonly []>,
		] extends [
			infer InferredInput extends readonly any[],
			infer InferredPatternValue,
		]
			? DCommon.Or<[
				DCommon.IsEqual<InferredPatternValue, never>,
				DCommon.IsEqual<InferredInput, never>,
			]> extends true
				? never
				: {}
			: never
	)
);
