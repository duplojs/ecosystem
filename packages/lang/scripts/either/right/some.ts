import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind, informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "./create";

export const someKind = createKind("some");

export interface Some<
	GenericValue extends unknown,
> extends DCommon.Forward<
		& DKind.Kind<typeof someKind>
		& Right<"some", GenericValue>
	> {

}

export function some<
	GenericValue extends unknown,
>(
	value: GenericValue,
): Some<GenericValue> {
	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "some",
		[valueKind.runTimeKey]: value,
		[someKind.runTimeKey]: null,
	} as never;
}
