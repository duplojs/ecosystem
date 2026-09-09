import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
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
			DKind.GetValue<
				typeof informationKind,
				Extract<GenericInput, Either>
			>
		>,
		string
	>
>;

export function whenIsSelected<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
	const GenericOutput extends unknown,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: GetValue<
			Extract<
				GenericInput,
				Either & DKind.Kind<
					typeof informationKind,
					Extract<
						(
							| DObject.GetPropsWithValue<GenericSelector, true>
							| DObject.GetPropsWithValue<GenericSelector, boolean>
						),
						string
					>
				>
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| GenericOutput
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

export function whenIsSelected<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
	const GenericOutput extends unknown,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
	theFunction: (
		value: GetValue<
			Extract<
				GenericInput,
				Either & DKind.Kind<
					typeof informationKind,
					Extract<
						(
							| DObject.GetPropsWithValue<GenericSelector, true>
							| DObject.GetPropsWithValue<GenericSelector, boolean>
						),
						string
					>
				>
			>
		>,
	) => GenericOutput,
): (
	| GenericOutput
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

export function whenIsSelected(
	...args:
		| [
			input: unknown,
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
		]
		| [
			selector: Record<string, boolean>,
			theFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 2) {
		const [selector, theFunction] = args;

		return (input: unknown) => whenIsSelected(
			input as never,
			selector as never,
			theFunction,
		);
	}

	const [input, selector, theFunction] = args;

	if (
		informationKind.has(input)
		&& valueKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	) {
		return theFunction(valueKind.getValue(input));
	}

	return input;
}
