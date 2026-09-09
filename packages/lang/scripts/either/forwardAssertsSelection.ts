import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import type { Left } from "./left";
import type { Right } from "./right";
import { createKind, informationKind } from "./kind";

export class ForwardAssertsSelectionError extends DKind.parentClass(
	createKind("forward-asserts-selection-error"),
	Error,
) {
	public constructor(
		public value: unknown,
		public selector: Record<string, boolean>,
	) {
		super(undefined, "Either information is not selected.");
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
			DKind.GetValue<
				typeof informationKind,
				Extract<GenericInput, Either>
			>
		>,
		string
	>
>;

type SelectedInput<
	GenericInput extends unknown,
	GenericSelector extends Record<string, boolean>,
> = (
	| Extract<
		GenericInput,
		DKind.Kind<
			typeof informationKind,
			Extract<
				| DObject.GetPropsWithValue<GenericSelector, true>
				| DObject.GetPropsWithValue<GenericSelector, boolean>,
				string
			>
		>
	>
	| Exclude<GenericInput, Either>
);

export function forwardAssertsSelection<
	GenericInput extends Either | DCommon.AnyValue,
	GenericSelector extends Record<
		DKind.GetValue<
			typeof informationKind,
			Extract<GenericInput, Either>
		>,
		boolean
	>,
>(
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): (input: GenericInput) => Extract<
	SelectedInput<GenericInput, GenericSelector>,
	any
>;

export function forwardAssertsSelection<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericSelector extends Record<
		DKind.GetValue<
			typeof informationKind,
			Extract<GenericInput, Either>
		>,
		boolean
	>,
>(
	input: GenericInput,
	selector: GenericSelector & ForbiddenMoreKey<GenericInput, GenericSelector>,
): Extract<
	SelectedInput<GenericInput, GenericSelector>,
	any
>;

export function forwardAssertsSelection(
	...args:
		| [input: unknown, selector: Record<string, boolean>]
		| [selector: Record<string, boolean>]
) {
	if (args.length === 1) {
		const [selector] = args;

		return (input: unknown) => forwardAssertsSelection(input as never, selector as never);
	}

	const [input, selector] = args;

	if (
		informationKind.has(input)
		&& selector[informationKind.getValue(input)] !== true
	) {
		throw new ForwardAssertsSelectionError(input, selector);
	}

	return input;
}
