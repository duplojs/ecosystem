import * as DCommon from "@scripts/common";
import type { FlatObject, GetPropsWithValueExtends, UnFlatObject } from "./types";
import { getDeepProperty } from "./getDeepProperty";

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

export function deepDiscriminate<
	GenericInput extends object,
	GenericObjectProjection extends ObjectProjection<GenericInput>,
	GenericPath extends keyof GenericObjectProjection,
	GenericValue extends Extract<GenericObjectProjection[GenericPath], DCommon.EligibleEqual>,
>(
	path: GenericPath,
	value: DCommon.MaybeArray<GenericValue>,
): (
	input: GenericInput,
) => input is Extract<
	GenericInput,
	UnFlatObject<{ [Prop in GenericPath]: GenericValue }>
>;

export function deepDiscriminate<
	GenericInput extends object,
	GenericObjectProjection extends ObjectProjection<GenericInput>,
	GenericPath extends keyof GenericObjectProjection,
	GenericValue extends Extract<GenericObjectProjection[GenericPath], DCommon.EligibleEqual>,
>(
	input: GenericInput,
	path: GenericPath,
	value: DCommon.MaybeArray<GenericValue>,
): input is Extract<
	GenericInput,
	UnFlatObject<{ [Prop in GenericPath]: GenericValue }>
>;

export function deepDiscriminate(
	...args:
		| [path: string, value: DCommon.MaybeArray<DCommon.EligibleEqual>]
		| [input: object, path: string, value: DCommon.MaybeArray<DCommon.EligibleEqual>]
) {
	if (args.length === 2) {
		const [path, value] = args;

		return (input: object) => deepDiscriminate(input, path as never, value as never);
	}

	const [input, path, value] = args;

	return DCommon.equal(
		getDeepProperty(input, path as never),
		value as never,
	);
}
