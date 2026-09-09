import type * as DObject from "@scripts/object";
import type { AnyFunction, AnyTuple, ComputedTypeError, IsEqual, NeverCoalescing, Or, UnionToIntersection } from "./types";

export type Transformer<
	GenericValue extends unknown,
	GenericMethodName extends string,
> = GenericValue extends Record<GenericMethodName, () => unknown>
	? ReturnType<GenericValue[GenericMethodName]>
	: GenericValue extends readonly unknown[] & AnyTuple
		? Transformer<GenericValue[number], GenericMethodName>[]
		: GenericValue extends readonly [infer InferredFirst, ...infer InferredRest]
			? [
				Transformer<InferredFirst, GenericMethodName>,
				...Extract<Transformer<InferredRest, GenericMethodName>, readonly unknown[]>,
			]
			: GenericValue extends readonly []
				? []
				: GenericValue extends readonly unknown[]
					? Transformer<GenericValue[number], GenericMethodName>[]
					: GenericValue extends string
						? GenericValue
						: GenericValue extends Record<number, unknown>
							? {
								[Prop in keyof GenericValue]: Transformer<GenericValue[Prop], GenericMethodName>
							}
							: GenericValue;

type TransformArgumentObjectErrors<
	GenericValue extends unknown,
	GenericMethodName extends string,
> = {
	[Prop in keyof GenericValue]: CheckTransformArgument<
		GenericValue[Prop],
		GenericMethodName
	>
} extends infer InferredResult extends object
	? UnionToIntersection<
		NeverCoalescing<
			InferredResult[
				DObject.GetPropsWithValueExtends<
					InferredResult,
					object
				>
			],
			unknown
		>
	>
	: never;

type CheckTransformArgumentValue<
	GenericValue extends unknown,
	GenericMethodName extends string,
> = Or<[
	IsEqual<GenericValue, unknown>,
	IsEqual<GenericValue, never>,
	IsEqual<GenericValue, object>,
	IsEqual<GenericValue, any>,
	IsEqual<GenericMethodName, string>,
]> extends true
	? ComputedTypeError<"Input contain an indeterminate value.">
	: GenericValue extends Record<GenericMethodName, () => unknown>
		? unknown
		: GenericValue extends Record<GenericMethodName, AnyFunction>
			? ComputedTypeError<`A method ${GenericMethodName} in input have an argument.`>
			: GenericValue extends readonly unknown[] & AnyTuple
				? CheckTransformArgument<
					Extract<GenericValue, readonly unknown[]>[number],
					GenericMethodName
				>
				: GenericValue extends readonly [infer InferredFirst, ...infer InferredRest]
					? (
						& CheckTransformArgument<InferredFirst, GenericMethodName>
						& CheckTransformArgument<InferredRest, GenericMethodName>
					)
					: GenericValue extends readonly []
						? unknown
						: GenericValue extends string
							? unknown
							: GenericValue extends readonly (infer InferredValue)[]
								? CheckTransformArgument<InferredValue, GenericMethodName>
								: GenericValue extends Record<number, unknown>
									? TransformArgumentObjectErrors<
										GenericValue,
										GenericMethodName
									>
									: unknown;

export type CheckTransformArgument<
	GenericValue extends unknown,
	GenericMethodName extends string = string,
> = NeverCoalescing<
	GenericValue extends unknown
		? CheckTransformArgumentValue<
			GenericValue,
			GenericMethodName
		> extends infer InferredResult
			? IsEqual<InferredResult, unknown> extends true
				? never
				: InferredResult
			: never
		: never,
	unknown
>;

export function transformer<
	GenericInput extends unknown,
	GenericMethodName extends string,
>(
	input: GenericInput & CheckTransformArgument<GenericInput, GenericMethodName>,
	methodName: GenericMethodName,
): Transformer<GenericInput, GenericMethodName>;

export function transformer(
	input: unknown,
	methodName: string,
): unknown {
	if (
		input
		&& typeof input === "object"
		&& methodName in input
		&& typeof input[methodName as never] === "function"
	) {
		return (input[methodName as never] as AnyFunction)();
	} else if (
		typeof input === "object"
		&& input !== null
		&& (
			!input.constructor
			|| input.constructor.name === "Object"
		)
	) {
		const output: Record<string, unknown> = {};

		for (const key in input) {
			output[key as string] = transformer(input[key as never], methodName);
		}

		return output;
	} else if (
		input instanceof Array
		&& input.constructor.name === "Array"
	) {
		const length = input.length;
		const output = [];
		for (let index = 0; index < length; index++) {
			output[index] = transformer(input[index], methodName);
		}

		return output;
	} else {
		return input;
	}
}

export type TransformerFunction<
	GenericMethodName extends string = string,
> = <
	GenericInput extends unknown,
>(input: GenericInput) => Transformer<
	GenericInput,
	GenericMethodName
>;

export function createTransformer<
	GenericMethodName extends string,
>(
	methodName: GenericMethodName,
): TransformerFunction<GenericMethodName>;

export function createTransformer(
	methodName: string,
): TransformerFunction {
	return (input) => transformer(input as never, methodName);
}

export const toNative = createTransformer("toNative");
export const toJSON = createTransformer("toJSON");
