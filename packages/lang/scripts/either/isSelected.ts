import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
import { informationKind } from "./kind";
import type { GetInformation } from "./types";

type Either = Right | Left;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = DObject.ForbiddenKey<
	GenericSelector,
	Extract<
		Exclude<
			keyof GenericSelector,
			DKind.GetValue<
				typeof informationKind,
				Extract<GenericInput, Either>
			>
		>,
		string
	>
>;

type SelectedEither<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = Extract<
	GenericInput,
	Either & DKind.Kind<
		typeof informationKind,
		Extract<DObject.GetPropsWithValue<GenericSelector, true>, string>
	>
>;

export function isSelected<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (input: GenericInput) => input is SelectedEither<GenericInput, GenericSelector>;

export function isSelected<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): input is SelectedEither<GenericInput, GenericSelector>;

export function isSelected(
	...args:
		| [input: unknown, selector: Record<string, boolean>]
		| [selector: Record<string, boolean>]
): any {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => isSelected(
			input as never,
			selector as never,
		);
	}

	const [input, selector] = args;

	return (
		informationKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	);
}
