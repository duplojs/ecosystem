import type { IsEqual, AnyFunction, AnyPredicate, IsUnion, Predicate, IsNever } from "./types";

type PredicateList<
	GenericInput extends unknown,
> = readonly [
	(input: GenericInput) => input is any,
	(input: GenericInput) => input is any,
	...((input: GenericInput) => input is any)[],
];

type ExtractPredicate<
	GenericPredicateList extends readonly AnyFunction<any[], boolean>[],
	GenericResult extends unknown = unknown,
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
				: IsEqual<Predicate<InferredFirstPredicate>, any> extends true
					? unknown
					: IsNever<Predicate<InferredFirstPredicate>> extends true
						? unknown
						: InferredRest extends readonly []
							? [GenericResult & Predicate<InferredFirstPredicate>]
							: ExtractPredicate<InferredRest, GenericResult & Predicate<InferredFirstPredicate>>
			: never;

type ComputeResult<
	GenericInput extends unknown,
	GenericPredicateList extends readonly AnyFunction<any[], boolean>[],
> = ExtractPredicate<GenericPredicateList> extends readonly [infer InferredOutput]
	? GenericInput extends InferredOutput
		? GenericInput
		: InferredOutput extends GenericInput
			? InferredOutput
			: GenericInput & InferredOutput
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
			: unknown
		: never;

export function and<
	GenericInput extends unknown,
	const GenericPredicateList extends PredicateList<GenericInput>,
>(
	predicateList: GenericPredicateList & IsPredicateOutputCompatible<GenericInput, GenericPredicateList>,
): (input: GenericInput) => input is ComputeResult<
	GenericInput,
	GenericPredicateList
>;

export function and<
	GenericInput extends unknown,
>(
	predicateList: readonly [
		(input: GenericInput) => boolean,
		(input: GenericInput) => boolean,
		...((input: GenericInput) => boolean)[],
	],
): (input: GenericInput) => boolean;

export function and<
	GenericInput extends unknown,
	const GenericPredicateList extends PredicateList<GenericInput>,
>(
	input: GenericInput,
	predicateList: GenericPredicateList & IsPredicateOutputCompatible<GenericInput, GenericPredicateList>,
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
		| [input: unknown, predicateList: readonly AnyFunction[]]
		| [predicateList: readonly AnyFunction[]]
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
