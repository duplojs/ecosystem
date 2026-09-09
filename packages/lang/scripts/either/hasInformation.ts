import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import type { Left } from "./left";
import type { Right } from "./right";
import { informationKind, valueKind } from "./kind";
import type { GetInformation } from "./types";

type Either = Right | Left;

export function hasInformation<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	information: GenericInformation | GenericInformation[],
): (
	input: GenericInput,
) => input is Extract<
	GenericInput,
	DKind.Kind<typeof informationKind, GenericInformation>
	& DKind.Kind<typeof valueKind>
>;

export function hasInformation<
	const GenericInput extends Either | DCommon.AnyValue,
	GenericInformation extends(
		GenericInput extends Either
			? GetInformation<GenericInput>
			: never
	),
>(
	input: GenericInput,
	information: GenericInformation | GenericInformation[],
): input is Extract<
	GenericInput,
	DKind.Kind<typeof informationKind, GenericInformation>
	& DKind.Kind<typeof valueKind>
>;

export function hasInformation(
	...args:
		| [information: DCommon.MaybeArray<string>]
		| [input: unknown, information: DCommon.MaybeArray<string>]
): any {
	if (args.length === 1) {
		const [information] = args;

		return (input: unknown) => hasInformation(input as never, information as never);
	}

	const [input, information] = args;
	const formattedInformation = DArray.coalescing(information);

	return informationKind.has(input)
		&& valueKind.has(input)
		&& formattedInformation.includes(informationKind.getValue(input));
}
