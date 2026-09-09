import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type { Left } from "./left";
import type { Right } from "./right";
import { informationKind, valueKind } from "./kind";
import type { GetInformation, GetValue } from "./types";

type Either = Right | Left;

export function whenHasInformationOtherwise<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
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
	otherwiseFunction: (
		value: Exclude<
			DCommon.BreakGenericLink<GenericInput>,
			DKind.Kind<typeof informationKind, GenericInformation>
		>,
	) => GenericOtherwiseOutput,
): (input: GenericInput) => GenericOutput | GenericOtherwiseOutput;

export function whenHasInformationOtherwise<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<Extract<GenericInput, Either>>
			: never
	),
	const GenericOutput extends unknown,
	const GenericOtherwiseOutput extends unknown,
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
	otherwiseFunction: (
		value: Exclude<
			DCommon.BreakGenericLink<GenericInput>,
			DKind.Kind<typeof informationKind, GenericInformation>
		>,
	) => GenericOtherwiseOutput,
): GenericOutput | GenericOtherwiseOutput;

export function whenHasInformationOtherwise(
	...args:
		| [
			input: unknown,
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
		| [
			information: string | readonly string[],
			theFunction: DCommon.AnyFunction,
			otherwiseFunction: DCommon.AnyFunction,
		]
): any {
	if (args.length === 3) {
		const [information, theFunction, otherwiseFunction] = args;

		return (input: unknown) => whenHasInformationOtherwise(
			input as never,
			information as never,
			theFunction,
			otherwiseFunction,
		);
	}

	const [input, information, theFunction, otherwiseFunction] = args;
	const formattedInformation = information instanceof Array
		? information
		: [information];

	if (
		informationKind.has(input)
		&& valueKind.has(input)
		&& formattedInformation.includes(informationKind.getValue(input))
	) {
		return theFunction(valueKind.getValue(input));
	}

	return otherwiseFunction(input);
}
