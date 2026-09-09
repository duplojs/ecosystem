import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DTuple from "@scripts/tuple";
import type { patternValueMaybeAllKind } from "../kind";

export type EligiblePrimitiveMatch = string | number | bigint | boolean | undefined | null;

type PrimitivePattern<
	GenericInput extends unknown,
> = GenericInput extends EligiblePrimitiveMatch
	? GenericInput
	: never;

type ObjectPattern<
	GenericInput extends unknown,
> = Exclude<GenericInput, readonly any[]> extends infer InferredInput
	? [
		Extract<InferredInput, object>,
		InferredInput extends object ? keyof InferredInput : never,
	] extends [
		infer InferredInputObject extends object,
		infer InferredInputKeyofObject extends DCommon.ObjectKey,
	]
		? {
			readonly [Prop in InferredInputKeyofObject]?: Extract<
				InferredInputObject,
				Partial<Record<Prop, any>>
			> extends infer InferredValue extends object
				? Prop extends keyof InferredValue
					? Pattern<InferredValue[Prop]>
					: never
				: never
		} extends infer InferredResult
			? DCommon.IsEqual<InferredResult, {}> extends true
				? never
				: InferredResult
			: never
		: never
	: never;

type ArrayPattern<
	GenericInput extends unknown,
> = (
	| (
		Extract<GenericInput, DCommon.AnyTuple> extends infer InferredInput extends DCommon.AnyTuple
			? DCommon.IsEqual<InferredInput, never> extends true
				? never
				: DTuple.MergeUnion<InferredInput> extends readonly [infer InferredFirst, ...infer InferredRest]
					? (
						| readonly []
						| readonly [Pattern<InferredFirst>]
						| (
							InferredRest extends readonly []
								? never
								: readonly [
									Pattern<InferredFirst>,
									...Extract<
										Pattern<InferredRest>,
										readonly any[]
									>,
								]
						)
					)
					: never
			: never
	)
	| (
		Exclude<
			Extract<GenericInput, readonly any[]>,
			DCommon.AnyTuple
		> extends infer InferredInput extends readonly any[]
			? DCommon.IsEqual<InferredInput, never> extends true
				? never
				: readonly Pattern<InferredInput[number]>[]
			: never
	)
);

type PredicatePattern<
	GenericInput extends unknown = any,
> = (input: GenericInput) => boolean;

const SymbolToolPattern = Symbol.for("SymbolToolPatternLabel");
type SymbolToolPattern = typeof SymbolToolPattern;

export const SymbolToolPatternFunctionLabel = "SymbolToolPatternFunctionLabel";
const SymbolToolPatternFunction = Symbol.for(SymbolToolPatternFunctionLabel);
type SymbolToolPatternFunction = typeof SymbolToolPatternFunction;

export interface ToolPattern<
	GenericInput extends unknown = any,
	GenericPattern extends unknown = any,
> {
	[SymbolToolPatternFunction](input: GenericInput): boolean;
	[SymbolToolPattern]: GenericPattern;
}

export type Pattern<
	GenericInput extends unknown = any,
> = (
	DCommon.IsEqual<GenericInput, unknown> extends true
		? DCommon.AnyValue
		: GenericInput
) extends infer InferredInput
	? (
		| PredicatePattern<InferredInput>
		| ToolPattern<InferredInput>
		| PrimitivePattern<InferredInput>
		| ObjectPattern<InferredInput>
		| ArrayPattern<InferredInput>
	)
	: never;

export interface PatternValueMaybeAll<
	GenericValue extends unknown = any,
> extends DKind.Kind<typeof patternValueMaybeAllKind, GenericValue> {

}

export type PatternValue<
	GenericPattern extends Pattern,
> = GenericPattern extends EligiblePrimitiveMatch
	? GenericPattern
	: GenericPattern extends (input: any) => input is infer InferredPredicate
		? InferredPredicate
		: GenericPattern extends (input: infer InferredInput) => boolean
			? PatternValueMaybeAll<InferredInput>
			: GenericPattern extends ToolPattern<any, infer InferredPattern>
				? PatternValue<InferredPattern>
				: GenericPattern extends readonly [infer inferredFirst, ...infer inferredRest]
					? DCommon.IsEqual<inferredRest, readonly []> extends true
						? [PatternValue<inferredFirst>]
						: [PatternValue<inferredFirst>, ...Extract<PatternValue<inferredRest>, any[]>]
					: GenericPattern extends readonly []
						? []
						: GenericPattern extends readonly any[]
							? PatternValue<GenericPattern[number]>[]
							: GenericPattern extends Record<DCommon.ObjectKey, Pattern>
								? {
									[Prop in keyof GenericPattern]: PatternValue<GenericPattern[Prop]>
								}
								: never;
