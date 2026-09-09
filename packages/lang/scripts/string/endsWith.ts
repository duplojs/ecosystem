import type * as DCommon from "@scripts/common";

type EndWithOutput<
	GenericString extends string,
	GenericSearchString extends string,
> = Extract<GenericString, `${string}${GenericSearchString}`> extends infer InferredResult extends GenericString
	? DCommon.IsEqual<InferredResult, never> extends true
		? GenericString & `${string}${GenericSearchString}`
		: InferredResult
	: never;

export function endsWith<
	GenericString extends string,
	GenericSearchString extends string,
>(
	searchString: GenericSearchString,
): (
	string: GenericString,
) => string is EndWithOutput<GenericString, GenericSearchString>;

export function endsWith<
	GenericString extends string,
	GenericSearchString extends string,
>(
	string: GenericString,
	searchString: GenericSearchString,
): string is EndWithOutput<GenericString, GenericSearchString>;

export function endsWith(
	...args:
		| [searchString: string]
		| [string: string, searchString: string]
): any {
	if (args.length === 1) {
		const [searchString] = args;

		return (string: string) => endsWith(string, searchString);
	}

	const [string, searchString] = args;

	return string.endsWith(searchString);
}
