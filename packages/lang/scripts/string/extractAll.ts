import * as DGenerator from "@scripts/generator";
import type { ExtractOutput } from "./extract";

export function extractAll<
	GenericString extends string,
>(
	pattern: RegExp,
): (
	string: GenericString,
) => Generator<ExtractOutput<GenericString>>;

export function extractAll<
	GenericString extends string,
>(
	string: GenericString,
	pattern: RegExp,
): Generator<ExtractOutput<GenericString>>;

export function extractAll(
	...args:
		| [pattern: RegExp]
		| [string: string, pattern: RegExp]
): any {
	if (args.length === 1) {
		const [pattern] = args;

		return (string: string) => extractAll(string, pattern);
	}

	const [string, pattern] = args;

	return DGenerator.map(
		string.matchAll(pattern),
		(value) => ({
			matchedValue: value[0],
			groups: value.slice(1),
			namedGroups: value.groups ? { ...value.groups } : undefined,
			offset: value.index ?? 0,
			self: value.input ?? string,
		}),
	);
}
