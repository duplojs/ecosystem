import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import { isRight, type Right } from "./right";
import { isLeft, type Left } from "./left";
import { informationKind, valueKind } from "./kind";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

export function whenHasInformation<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
>(
	information: GenericInformation | readonly GenericInformation[],
	theFunction: (
		value: GetValue<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Either & DKind.Kind<typeof informationKind, GenericInformation>
			>
		>,
	) => GenericOutput,
): (input: GenericInput) => (
	| GenericOutput
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
);

export function whenHasInformation<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
>(
	input: GenericInput,
	information: GenericInformation | readonly GenericInformation[],
	theFunction: (
		value: GetValue<
			Extract<
				DCommon.BreakGenericLink<GenericInput>,
				Either & DKind.Kind<typeof informationKind, GenericInformation>
			>
		>,
	) => GenericOutput,
): (
	| GenericOutput
	| Exclude<
		DCommon.BreakGenericLink<GenericInput>,
		DKind.Kind<typeof informationKind, GenericInformation>
	>
);

export function whenHasInformation(
	...args:
		| [
			input: unknown,
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
		]
		| [
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 2) {
		const [information, theFunction] = args;

		return (input: unknown) => whenHasInformation(
			input as never,
			information as never,
			theFunction,
		);
	}

	const [input, information, theFunction] = args;

	const formattedInformation = information instanceof Array
		? information
		: [information];

	if (
		(
			isLeft(input)
			|| isRight(input)
		) && formattedInformation.includes(
			informationKind.getValue(input),
		)
	) {
		return theFunction(valueKind.getValue(input));
	}

	return input;
}
