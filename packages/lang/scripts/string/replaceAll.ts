import type { StringReplacer } from "./replace";

export function replaceAll<
	GenericString extends string,
>(
	pattern: string | RegExp,
	replacement: string | StringReplacer<GenericString>,
): (string: GenericString) => string;

export function replaceAll<
	GenericString extends string,
>(
	string: GenericString,
	pattern: string | RegExp,
	replacement: string | StringReplacer<GenericString>,
): string;

export function replaceAll(
	...args:
		| [pattern: string | RegExp, replacement: string | StringReplacer]
		| [string: string, pattern: string | RegExp, replacement: string | StringReplacer]
): any {
	if (args.length === 2) {
		const [pattern, replacement] = args;

		return (string: string) => replaceAll(string, pattern, replacement);
	}

	const [string, pattern, replacement] = args;

	const globalPattern = typeof pattern === "string" || pattern.global
		? pattern
		: new RegExp(pattern, `${pattern.flags}g`);

	if (typeof replacement === "function") {
		return string.replaceAll(
			globalPattern,
			(
				matchedValue,
				...argsRest: (
					| [
						...captures: (string | undefined)[],
						offset: number,
						self: string,
					]
					| [
						...captures: (string | undefined)[],
						offset: number,
						self: string,
						namedGroups: Record<string, string | undefined>,
					]
				)
			) => {
				const namedGroups = typeof argsRest[argsRest.length - 1] === "object"
					? argsRest.pop() as Record<string, string | undefined>
					: {};

				const [offset, self] = argsRest.splice(-2, 2) as [number, string];

				return replacement({
					matchedValue,
					namedGroups,
					offset,
					self,
					groups: argsRest as (string | undefined)[],
				});
			},
		);
	}

	return string.replaceAll(globalPattern, replacement);
}
