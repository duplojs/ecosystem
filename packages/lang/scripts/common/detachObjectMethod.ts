import type * as DObject from "@scripts/object";
import type { AnyFunction } from "./types";

export function detachObjectMethod<
	GenericObject extends object,
	GenericMethod extends keyof GenericObject,
>(
	object: GenericObject,
	method: GenericMethod & DObject.GetPropsWithValueExtends<GenericObject, AnyFunction>,
): GenericObject[GenericMethod];

export function detachObjectMethod(
	object: object,
	method: PropertyKey,
) {
	return (object[method as never] as AnyFunction).bind(object);
}
