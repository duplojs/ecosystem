import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";

export const rightKind = createKind("right");

type _Right<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> = (
	& DKind.Kind<typeof rightKind>
	& DKind.Kind<
		typeof informationKind,
		GenericInformation
	>
	& DKind.Kind<
		typeof valueKind,
		GenericValue
	>
);

export interface Right<
	GenericInformation extends string = string,
	GenericValue extends unknown = unknown,
> extends _Right<GenericInformation, GenericValue> {

}

export function right<
	GenericInformation extends string,
	const GenericValue extends unknown = undefined,
>(
	information: GenericInformation,
	value?: GenericValue,
): Right<
	GenericInformation,
	GenericValue
>;

export function right(
	information: string,
	value: unknown = undefined,
) {
	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: information,
		[valueKind.runTimeKey]: value,
	} as never;
}
