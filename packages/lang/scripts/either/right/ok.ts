import type * as DKind from "@scripts/kind";
import { createKind, informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "./create";

export const okKind = createKind("ok");

type _Ok = (
	& Right<"ok", void>
	& DKind.Kind<typeof okKind>
);

export interface Ok extends _Ok {

}

export function ok(): Ok;

export function ok() {
	return {
		[rightKind.runTimeKey]: null,
		[informationKind.runTimeKey]: "ok",
		[valueKind.runTimeKey]: undefined,
		[okKind.runTimeKey]: null,
	} as never;
}
