import type * as DKind from "@scripts/kind";
import type * as DCommon from "@scripts/common";
import { createKind, informationKind, valueKind } from "../kind";
import { type Left, leftKind } from "./create";

export const noneKind = createKind("none");

export interface None extends DCommon.Forward<
	& DKind.Kind<typeof noneKind>
	& Left<"none", null>
> {

}

export function none(): None {
	return {
		[leftKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "none",
		[valueKind.runTimeKey]: null,
		[noneKind.runTimeKey]: null,
	} as never;
}
