import type { IsEqual, AnyFunction, UnionToIntersection } from "./types";

type ExtractIntersection<
	GenericInput extends unknown,
	GenericPredicateList extends AnyFunction<any[], boolean>[],
	GenericResult extends unknown = GenericInput,
> = GenericPredicateList extends [
	(input: any) => input is infer InferredPredicate,
	...infer InferredRest extends AnyFunction<any[], boolean>[],
]
	? Extract<GenericResult, InferredPredicate> extends infer InferredResult extends GenericInput
		? InferredRest extends readonly []
			? InferredResult
			: ExtractIntersection<GenericInput, InferredRest, InferredResult>
		: never
	: never;

type ExtractPredicate<
	GenericInput extends unknown,
	GenericPredicateList extends AnyFunction<any[], boolean>[],
> = GenericPredicateList extends [
	(input: any) => input is infer InferredPredicate,
	...infer InferredRest extends AnyFunction<any[], boolean>[],
]
	? InferredRest extends readonly []
		? InferredPredicate
		: InferredPredicate | ExtractPredicate<GenericInput, InferredRest>
	: GenericInput;

type ComputeResult<
	GenericInput extends unknown,
	GenericPredicateList extends AnyFunction<any[], boolean>[],
> = ExtractIntersection<
	GenericInput,
	GenericPredicateList
> extends infer InferredResult extends GenericInput
	? IsEqual<InferredResult, never> extends true
		? GenericInput & UnionToIntersection<
			ExtractPredicate<
				GenericInput,
				GenericPredicateList
			>
		>
		: InferredResult
	: never;

export function and<
	GenericInput extends unknown,
	GenericPredicateList extends [
		(input: GenericInput) => input is any,
		(input: GenericInput) => input is any,
		...((input: GenericInput) => input is any)[],
	],
>(
	predicateList: GenericPredicateList,
): (input: GenericInput) => input is ComputeResult<
	GenericInput,
	GenericPredicateList
>;

export function and<
	GenericInput extends unknown,
>(
	predicateList: [
		(input: GenericInput) => boolean,
		(input: GenericInput) => boolean,
		...((input: GenericInput) => boolean)[],
	],
): (input: GenericInput) => boolean;

export function and<
	GenericInput extends unknown,
	GenericPredicateList extends [
		(input: GenericInput) => input is any,
		(input: GenericInput) => input is any,
		...((input: GenericInput) => input is any)[],
	],
>(
	input: GenericInput,
	predicateList: GenericPredicateList,
): input is ComputeResult<
	GenericInput,
	GenericPredicateList
>;

export function and<
	GenericInput extends unknown,
>(
	input: GenericInput,
	predicateList: [
		(input: GenericInput) => boolean,
		(input: GenericInput) => boolean,
		...((input: GenericInput) => boolean)[],
	],
): boolean;

export function and(
	...args:
		| [input: unknown, predicateList: AnyFunction[]]
		| [predicateList: AnyFunction[]]
): any {
	if (args.length === 1) {
		const [predicateList] = args;

		return (input: unknown) => and(input, predicateList as never);
	}

	const [input, predicateList] = args;

	for (const predicate of predicateList) {
		if (!predicate(input)) {
			return false;
		}
	}

	return true;
}
