import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";
import { leftKind, type Left } from "./create";

export const errorKind = createKind("error");

type _Error<
	GenericValue extends unknown = unknown,
> = (
	& Left<"error", GenericValue>
	& DKind.Kind<typeof errorKind>
);

export interface Error<
	GenericValue extends unknown = unknown,
> extends _Error<GenericValue> {

}

export function error<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): Error<GenericValue>;

export function error(
	value: unknown,
) {
	return {
		[leftKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "error",
		[valueKind.runTimeKey]: value,
		[errorKind.runTimeKey]: null,
	} as never;
}
