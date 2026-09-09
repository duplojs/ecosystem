import type * as DCommon from "@scripts/common";
import { type Assign } from "./types";

export function assign<
	GenericObject extends object,
	GenericValue extends Partial<Record<keyof GenericObject, unknown>> & DCommon.AnyObject,
>(
	value: GenericValue,
): (
	object: GenericObject,
) => Assign<GenericObject, GenericValue>;

export function assign<
	GenericObject extends object,
	GenericValue extends Partial<Record<keyof GenericObject, unknown>> & DCommon.AnyObject,
>(
	object: GenericObject,
	value: GenericValue,
): Assign<GenericObject, GenericValue>;

export function assign(
	...args:
		| [value: object]
		| [object: object, value: object]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (object: object) => assign(object, value);
	}

	const [object, value] = args;

	return {
		...object,
		...value,
	};
}
