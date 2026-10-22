import type * as DCommon from "@scripts/common";
import type { GetPropsWithValue, PartialKeys } from "./types";

type ComputeResultWithOmitIsObject<
	GenericInput extends object,
	GenericOmitValue extends Partial<Record<keyof GenericInput, boolean>>,
> = DCommon.SimplifyTopLevel<
	Omit<GenericInput, GetPropsWithValue<GenericOmitValue, true>> extends infer InferredValue extends object
		? PartialKeys<
			InferredValue,
			Extract<
				| GetPropsWithValue<GenericOmitValue, boolean>
				| GetPropsWithValue<GenericOmitValue, boolean | undefined>
				| GetPropsWithValue<GenericOmitValue, true | undefined>,
				keyof InferredValue
			>
		>
		: never
>;

type OmitValue<
	GenericInput extends object,
> =
	| Partial<Record<keyof GenericInput, boolean>>
	| readonly (keyof GenericInput)[];

type OmitOutput<
	GenericInput extends object,
	GenericOmitValue extends OmitValue<GenericInput>,
> = GenericOmitValue extends Partial<Record<keyof GenericInput, boolean>>
	? ComputeResultWithOmitIsObject<GenericInput, GenericOmitValue>
	: DCommon.SimplifyTopLevel<
		Omit<
			GenericInput,
			Extract<GenericOmitValue, readonly DCommon.ObjectKey[]>[number]
		>
	>;

export function omit<
	GenericInput extends object,
	const GenericOmitValue extends OmitValue<GenericInput>,
>(
	omitValue: GenericOmitValue,
): (
	input: GenericInput,
) => OmitOutput<GenericInput, GenericOmitValue>;

export function omit<
	GenericInput extends object,
	const GenericOmitValue extends OmitValue<GenericInput>,
>(
	input: GenericInput,
	omitValue: GenericOmitValue,
): OmitOutput<GenericInput, GenericOmitValue>;

export function omit(
	...args:
		| [omitValue: Partial<Record<DCommon.ObjectKey, boolean>> | readonly DCommon.ObjectKey[]]
		| [input: object, omitValue: Partial<Record<DCommon.ObjectKey, boolean>> | readonly DCommon.ObjectKey[]]
): any {
	if (args.length === 1) {
		const [omitValue] = args;

		return (input: object) => omit(input, omitValue as never);
	}

	const [input, omitValue] = args;

	const formattedOmitValue: Partial<Record<DCommon.ObjectKey, boolean>> = Array.isArray(omitValue)
		? omitValue.reduce<Partial<Record<DCommon.ObjectKey, boolean>>>(
			(acc, value: DCommon.ObjectKey) => {
				acc[value] = true;

				return acc;
			},
			{},
		)
		: { ...omitValue } as Partial<Record<DCommon.ObjectKey, boolean>>;

	const properties = { ...input } as Record<DCommon.ObjectKey, unknown>;

	return Reflect.ownKeys(properties)
		.reduce<Record<DCommon.ObjectKey, unknown>>(
			(acc, key) => {
				if (formattedOmitValue[key] !== true) {
					acc[key] = properties[key];
				}

				return acc;
			},
			{},
		);
}
