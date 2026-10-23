import * as DCommon from "@scripts/common";
import { isLeft, left, type Left } from "./left";
import type * as DKind from "@scripts/kind";
import { type GetInformation, type GetValue } from "./types";
import { valueKind } from "./kind";

type ErrorIdentifier<
	GenericInput extends unknown,
> = DKind.GetValue<
	typeof DCommon.duploJSErrorKind,
	Extract<
		GetValue<
			Extract<
				GenericInput,
				Left
			>
		>,
		DCommon.DuploJSError
	>
>;

type ExtractErrorInLeftOutput<
	GenericInput extends unknown,
	GenericErrorIdentifier extends string,
> = Extract<
	GenericInput extends Left
		? Extract<
			GetValue<GenericInput>,
			DCommon.DuploJSError<GenericErrorIdentifier>
		> extends infer InferredError extends DCommon.DuploJSError
			? DCommon.IsNever<InferredError> extends true
				? GenericInput
				: (
					| (
						DCommon.IsNever<Exclude<GetValue<GenericInput>, InferredError>> extends true
							? never
							: Left<
								GetInformation<GenericInput>,
								Exclude<GetValue<GenericInput>, InferredError>
							>
					)
					| (
						InferredError extends DCommon.DuploJSError
							? Left<
								DKind.GetValue<
									typeof DCommon.duploJSErrorKind,
									InferredError
								>,
								InferredError
							>
							: never
					)
				)
			: never
		: GenericInput,
	any
>;

export function extractErrorInLeft<
	GenericInput extends unknown,
	GenericErrorIdentifier extends ErrorIdentifier<GenericInput>,
>(
	errorIdentifier: GenericErrorIdentifier | GenericErrorIdentifier[],
): (input: GenericInput) => ExtractErrorInLeftOutput<
	GenericInput,
	GenericErrorIdentifier
>;

export function extractErrorInLeft<
	GenericInput extends unknown,
	GenericErrorIdentifier extends ErrorIdentifier<GenericInput>,
>(
	input: GenericInput,
	errorIdentifier: GenericErrorIdentifier | GenericErrorIdentifier[],
): ExtractErrorInLeftOutput<
	GenericInput,
	GenericErrorIdentifier
>;

export function extractErrorInLeft(
	...args:
		| [errorIdentifier: string | string[]]
		| [input: unknown, errorIdentifier: string | string[]]
): any {
	if (args.length === 1) {
		const [errorIdentifier] = args;

		return (input: unknown) => extractErrorInLeft(
			input as never,
			errorIdentifier as never,
		);
	}

	const [input, errorIdentifier] = args;

	if (!isLeft(input)) {
		return input;
	}

	const value = valueKind.getValue(input) as DCommon.DuploJSError | DCommon.AnyValue;

	if (DCommon.DuploJSError.hasIdentifier(value, errorIdentifier)) {
		return left(DCommon.duploJSErrorKind.getValue(value), value);
	}

	return input;
}
