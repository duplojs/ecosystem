import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";
import { leftKind, type Left } from "./create";

export const failKind = createKind("fail");

type _Fail = (
	& Left<"fail", void>
	& DKind.Kind<typeof failKind>
);

export interface Fail extends _Fail {

}

export function fail(): Fail;

export function fail() {
	return {
		[leftKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "fail",
		[valueKind.runTimeKey]: undefined,
		[failKind.runTimeKey]: null,
	} as never;
}
