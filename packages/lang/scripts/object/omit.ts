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

	const formattedOmitValue: Partial<Record<string, boolean>> = Array.isArray(omitValue)
		? omitValue.reduce<Partial<Record<string, boolean>>>(
			(acc, value) => {
				acc[String(value)] = true;

				return acc;
			},
			{},
		)
		: Object.fromEntries(Object.entries(omitValue));

	return Object.entries(input)
		.reduce<Record<string, unknown>>(
			(acc, [key, value]) => {
				if (formattedOmitValue[key] !== true) {
					acc[key] = value;
				}

				return acc;
			},
			{},
		);
}
