import type * as DCommon from "@scripts/common";
import type { FlatObject, GetPropsWithValueExtends } from "./types";

type ObjectProjection<
	GenericInput extends object,
> = FlatObject<GenericInput> extends infer InferredResult extends object
	? Omit<
		Pick<
			InferredResult,
			GetPropsWithValueExtends<
				InferredResult,
				DCommon.EligibleEqual
			>
		>,
		`${string}[${string}]${string}`
	>
	: never;

const regexExtractProperty = /([^.]*)(?:\.([^]*))?/;

function getDeepPropertyImplementation(
	input: object,
	path: string,
): any {
	const [, first, rest] = path.match(regexExtractProperty)!;
	const currentValue = (input as DCommon.AnyObject)[first!];

	if (rest) {
		return getDeepPropertyImplementation(currentValue as object, rest);
	}

	return currentValue;
}

export function getDeepProperty<
	GenericInput extends object,
	GenericObjectProjection extends ObjectProjection<GenericInput>,
	GenericPath extends keyof GenericObjectProjection,
>(
	path: GenericPath,
): (
	input: GenericInput,
) => GenericObjectProjection[GenericPath];

export function getDeepProperty<
	GenericInput extends object,
	GenericObjectProjection extends ObjectProjection<GenericInput>,
	GenericPath extends keyof GenericObjectProjection,
>(
	input: GenericInput,
	path: GenericPath,
): GenericObjectProjection[GenericPath];

export function getDeepProperty(
	...args: [object, string] | [string]
): any {
	if (args.length === 1) {
		const [path] = args;

		return (input: object) => getDeepProperty(input, path as never);
	}

	const [input, path] = args;

	return getDeepPropertyImplementation(input, path);
}
