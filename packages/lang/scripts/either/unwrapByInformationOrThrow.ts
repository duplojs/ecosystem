import * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import type { Left } from "./left";
import type { Right } from "./right";
import { createKind, valueKind, type informationKind } from "./kind";
import { hasInformation } from "./hasInformation";
import type { GetInformation, GetValue } from "./types";

export class HasNotInformationError extends DKind.parentClass(
	createKind("has-not-information-error"),
	Error,
) {
	public constructor(
		public value: unknown,
		public information: DCommon.MaybeArray<string>,
	) {
		const formattedInformation = information instanceof Array
			? information.join(" or ")
			: information;

		super(undefined, `Value has not information "${formattedInformation}".`);
	}
}

type Either = Right | Left;

export function unwrapByInformationOrThrow<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericInformation extends (
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	information: GenericInformation | GenericInformation[],
): (
	input: GenericInput,
) => GetValue<
	Extract<
		GenericInput,
		Either & DKind.Kind<typeof informationKind, GenericInformation>
	>
>;

export function unwrapByInformationOrThrow<
	GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): GetValue<
	Extract<
		GenericInput,
		Either & DKind.Kind<typeof informationKind, GenericInformation>
	>
>;

export function unwrapByInformationOrThrow(
	...args:
		| [DCommon.MaybeArray<string>]
		| [unknown, DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => unwrapByInformationOrThrow(
			input as never,
			information as never,
		);
	}

	const [input, information] = args;

	if (hasInformation(input as never, information as never)) {
		return valueKind.getValue(input as never);
	}

	throw new HasNotInformationError(input, information);
}
