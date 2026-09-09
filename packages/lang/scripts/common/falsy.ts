import type { FalsyValue, ForcePredicate, UnionContain } from "./types";

type Falsy<
	GenericInput extends unknown,
> =
	| Extract<GenericInput, FalsyValue>
	| (
		UnionContain<GenericInput, string> extends true
			? ""
			: never
	)
	| (
		UnionContain<GenericInput, number> extends true
			? 0
			: never
	)
	| (
		UnionContain<GenericInput, bigint> extends true
			? 0n
			: never
	);

export function falsy<
	GenericInput extends unknown,
>(input: GenericInput): input is ForcePredicate<
	GenericInput,
	Falsy<GenericInput>
>;

export function falsy(input: unknown): boolean {
	return !input;
}
