import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "./create";

export const successKind = createKind("success");

type _Success<
	GenericValue extends unknown = unknown,
> = (
	& Right<"success", GenericValue>
	& DKind.Kind<typeof successKind>
);

export interface Success<
	GenericValue extends unknown = unknown,
> extends _Success<GenericValue> {

}

export function success<
	const GenericValue extends unknown,
>(
	value: GenericValue,
): Success<GenericValue>;

export function success(
	value: unknown,
) {
	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "success",
		[valueKind.runTimeKey]: value,
		[successKind.runTimeKey]: null,
	} as never;
}
