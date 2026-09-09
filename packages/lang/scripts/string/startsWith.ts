import type * as DCommon from "@scripts/common";

type StartWithOutput<
	GenericString extends string,
	GenericSearchString extends string,
> = Extract<GenericString, `${GenericSearchString}${string}`> extends infer InferredResult extends GenericString
	? DCommon.IsEqual<InferredResult, never> extends true
		? GenericString & `${GenericSearchString}${string}`
		: InferredResult
	: never;

export function startsWith<
	GenericString extends string,
	GenericSearchString extends string,
>(
	searchString: GenericSearchString,
): (
	string: GenericString,
) => string is StartWithOutput<GenericString, GenericSearchString>;

export function startsWith<
	GenericString extends string,
	GenericSearchString extends string,
>(
	string: GenericString,
	searchString: GenericSearchString,
): string is StartWithOutput<GenericString, GenericSearchString>;

export function startsWith(
	...args:
		| [searchString: string]
		| [string: string, searchString: string]
): any {
	if (args.length === 1) {
		const [searchString] = args;

		return (string: string) => startsWith(string, searchString);
	}

	const [string, searchString] = args;

	return string.startsWith(searchString);
}
