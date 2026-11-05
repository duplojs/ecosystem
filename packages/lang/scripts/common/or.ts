import type { AnyPredicate, AnyFunction, UnionContain, IsEqual, IsUnion, Predicate } from "./types";

type PredicateList<
	GenericInput extends unknown,
> = readonly [
	(input: GenericInput) => input is any,
	(input: GenericInput) => input is any,
	...((input: GenericInput) => input is any)[],
];

type ExtractPredicate<
	GenericPredicateList extends readonly AnyFunction<any[], boolean>[],
> = IsUnion<GenericPredicateList> extends true
	? unknown
	: number extends GenericPredicateList["length"]
		? unknown
		: GenericPredicateList extends readonly [
			infer InferredFirstPredicate extends AnyPredicate,
			...infer InferredRest extends readonly AnyPredicate[],
		]
			? IsUnion<InferredFirstPredicate> extends true
				? unknown
				: InferredRest extends readonly []
					? Predicate<InferredFirstPredicate>
					: Predicate<InferredFirstPredicate> | ExtractPredicate<InferredRest>
			: never;

type IsPredicateOutputCompatible<
	GenericInput extends unknown,
	GenericPredicateList extends readonly AnyFunction<any[], boolean>[],
> = IsEqual<
	PredicateList<GenericInput>,
	GenericPredicateList
> extends true
	? unknown
	: ExtractPredicate<GenericPredicateList> extends infer InferredResult
		? IsEqual<InferredResult, unknown> extends true
			? never
			: UnionContain<
				GenericInput,
				InferredResult
			> extends true
				? unknown
				: never
		: never;

export function or<
	GenericInput extends unknown,
	const GenericPredicateList extends PredicateList<GenericInput>,
>(
	predicateList: GenericPredicateList & IsPredicateOutputCompatible<GenericInput, GenericPredicateList>,
): (input: GenericInput) => input is Extract<
	GenericInput,
	ExtractPredicate<
		GenericPredicateList
	>
>;

export function or<
	GenericInput extends unknown,
>(
	predicateList: readonly [
		(input: GenericInput) => boolean,
		(input: GenericInput) => boolean,
		...((input: GenericInput) => boolean)[],
	],
): (input: GenericInput) => boolean;

export function or<
	GenericInput extends unknown,
	const GenericPredicateList extends PredicateList<GenericInput>,
>(
	input: GenericInput,
	predicateList: GenericPredicateList & IsPredicateOutputCompatible<GenericInput, GenericPredicateList>,
): input is Extract<
	GenericInput,
	ExtractPredicate<
		GenericPredicateList
	>
>;

export function or<
	GenericInput extends unknown,
>(
	input: GenericInput,
	predicateList: readonly [
		(input: GenericInput) => boolean,
		(input: GenericInput) => boolean,
		...((input: GenericInput) => boolean)[],
	],
): boolean;

export function or(
	...args:
		| [input: unknown, predicateList: readonly AnyFunction[]]
		| [predicateList: readonly AnyFunction[]]
): any {
	if (args.length === 1) {
		const [predicateList] = args;

		return (input: unknown) => or(input, predicateList as never);
	}

	const [input, predicateList] = args;

	for (const predicate of predicateList) {
		if (predicate(input)) {
			return true;
		}
	}

	return false;
}
