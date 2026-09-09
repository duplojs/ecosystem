import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind, informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "../right/create";

export const noneKind = createKind("none");

export interface None extends DCommon.Forward<
	& DKind.Kind<typeof noneKind>
	& Right<"none", null>
> {

}

export function none(): None {
	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "none",
		[valueKind.runTimeKey]: null,
		[noneKind.runTimeKey]: null,
	} as never;
}
