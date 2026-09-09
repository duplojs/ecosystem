import * as DObject from "@scripts/object";
import type { ObjectKey, SimplifyTypeForce } from "./types";

export function clone<
	GenericValue extends unknown = unknown,
>(
	input: GenericValue,
): SimplifyTypeForce<GenericValue>;

export function clone(input: unknown): unknown {
	return cloneUnknown(input);
}

function cloneUnknown(input: unknown): unknown {
	if (!input) {
		return input;
	} else if (typeof input !== "object") {
		return input;
	} else if (input instanceof Array) {
		return input.map(cloneUnknown);
	} else {
		return DObject.entries(input)
			.reduce<Record<ObjectKey, unknown>>(
				(output, [key, value]) => {
					output[key] = cloneUnknown(value);

					return output;
				},
				{},
			);
	}
}
