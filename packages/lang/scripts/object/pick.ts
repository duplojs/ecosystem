import type * as DCommon from "@scripts/common";
import type { GetPropsWithValue } from "./types";

type ComputeResultWithPickIsObject<
	GenericInput extends object,
	GenericPickValue extends Partial<Record<keyof GenericInput, boolean>>,
> = DCommon.SimplifyTopLevel<
	& Pick<
		GenericInput,
		Extract<
			GetPropsWithValue<GenericPickValue, true>,
			keyof GenericInput
		>
	>
	& Partial<
		Pick<
			GenericInput,
			Extract<
				| GetPropsWithValue<GenericPickValue, boolean>
				| GetPropsWithValue<GenericPickValue, boolean | undefined>
				| GetPropsWithValue<GenericPickValue, true | undefined>,
				keyof GenericInput
			>
		>
	>
>;

type PickValue<
	GenericInput extends object,
> =
	| Partial<Record<keyof GenericInput, boolean>>
	| readonly (keyof GenericInput)[];

type PickOutput<
	GenericInput extends object,
	GenericPickValue extends PickValue<GenericInput>,
> = GenericPickValue extends Partial<Record<keyof GenericInput, boolean>>
	? ComputeResultWithPickIsObject<GenericInput, GenericPickValue>
	: DCommon.SimplifyTopLevel<
		Pick<
			GenericInput,
			Extract<GenericPickValue, readonly DCommon.ObjectKey[]>[number]
		>
	>;

export function pick<
	GenericInput extends object,
	const GenericPickValue extends PickValue<GenericInput>,
>(
	pickValue: GenericPickValue,
): (
	input: GenericInput,
) => PickOutput<GenericInput, GenericPickValue>;

export function pick<
	GenericInput extends object,
	const GenericPickValue extends PickValue<GenericInput>,
>(
	input: GenericInput,
	pickValue: GenericPickValue,
): PickOutput<GenericInput, GenericPickValue>;

export function pick(
	...args:
		| [pickValue: Partial<Record<DCommon.ObjectKey, boolean>> | readonly DCommon.ObjectKey[]]
		| [input: object, pickValue: Partial<Record<DCommon.ObjectKey, boolean>> | readonly DCommon.ObjectKey[]]
): any {
	if (args.length === 1) {
		const [pickValue] = args;

		return (input: object) => pick(input, pickValue as never);
	}

	const [input, pickValue] = args;

	const formattedPickValue: Partial<Record<string, boolean>> = Array.isArray(pickValue)
		? pickValue.reduce<Partial<Record<string, boolean>>>(
			(acc, value) => {
				acc[String(value)] = true;

				return acc;
			},
			{},
		)
		: Object.fromEntries(Object.entries(pickValue));

	return Object.entries(input)
		.reduce<Record<string, unknown>>(
			(acc, [key, value]) => {
				if (formattedPickValue[key] === true) {
					acc[key] = value;
				}

				return acc;
			},
			{},
		);
}
