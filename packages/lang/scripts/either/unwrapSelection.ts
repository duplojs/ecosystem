import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Right } from "./right";
import type { Left } from "./left";
import { informationKind, valueKind } from "./kind";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

type ForbiddenMoreKey<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = DObject.ForbiddenKey<
	GenericSelector,
	Extract<
		Exclude<
			keyof GenericSelector,
			GetInformation<Extract<GenericInput, Either>>
		>,
		string
	>
>;

export function unwrapSelection<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (input: GenericInput) => (
	| GetValue<
		Extract<
			GenericInput,
			Either & DKind.Kind<
				typeof informationKind,
				Extract<
					| DObject.GetPropsWithValue<GenericSelector, true>
					| DObject.GetPropsWithValue<GenericSelector, boolean>,
					string
				>
			>
		>
	>
	| Exclude<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				DObject.GetPropsWithValue<GenericSelector, true>,
				string
			>
		>
	>
);

export function unwrapSelection<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (
	| GetValue<
		Extract<
			GenericInput,
			Either & DKind.Kind<
				typeof informationKind,
				Extract<
					| DObject.GetPropsWithValue<GenericSelector, true>
					| DObject.GetPropsWithValue<GenericSelector, boolean>,
					string
				>
			>
		>
	>
	| Exclude<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				DObject.GetPropsWithValue<GenericSelector, true>,
				string
			>
		>
	>
);

export function unwrapSelection(
	...args:
		| [input: unknown, selector: Record<string, boolean>]
		| [selector: Record<string, boolean>]
): any {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => unwrapSelection(input as never, selector as never);
	}

	const [input, selector] = args;

	if (
		!informationKind.has(input)
		|| !valueKind.has(input)
	) {
		return input;
	}

	return selector[informationKind.getValue(input)] === true
		? valueKind.getValue(input)
		: input;
}
