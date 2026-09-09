import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";

export const leftKind = createKind("left");

type _Left<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> = (
	& DKind.Kind<typeof leftKind>
	& DKind.Kind<
		typeof informationKind,
		GenericInformation
	>
	& DKind.Kind<
		typeof valueKind,
		GenericValue
	>
);

export interface Left<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends _Left<GenericInformation, GenericValue> {

}

export function left<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
	value?: GenericValue,
): Left<
	GenericInformation,
	GenericValue
>;

export function left(
	information: string,
	value: unknown = undefined,
) {
	return {
		[leftKind.runTimeKey]: null,
		[informationKind.runTimeKey]: information,
		[valueKind.runTimeKey]: value,
	} as never;
}
