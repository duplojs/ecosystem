import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
import { createKind, informationKind, valueKind } from "./kind";
import type { GetInformation, GetValue } from "./types";

export class HasNotSelectedInformationError extends DKind.parentClass(
	createKind("has-not-selected-information-error"),
	Error,
) {
	public constructor(
		public value: unknown,
		public selector: Record<string, boolean>,
	) {
		super(undefined, "Value information is not selected.");
	}
}

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

export function unwrapSelectionOrThrow<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (input: GenericInput) => GetValue<
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
>;

export function unwrapSelectionOrThrow<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		GetInformation<Extract<GenericInput, Either>>,
		boolean
	>,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): GetValue<
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
>;

export function unwrapSelectionOrThrow(
	...args:
		| [input: unknown, selector: Record<string, boolean>]
		| [selector: Record<string, boolean>]
): any {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => unwrapSelectionOrThrow(input as never, selector as never);
	}

	const [input, selector] = args;

	if (
		informationKind.has(input)
		&& valueKind.has(input)
		&& selector[informationKind.getValue(input)] === true
	) {
		return valueKind.getValue(input);
	}

	throw new HasNotSelectedInformationError(input, selector);
}
