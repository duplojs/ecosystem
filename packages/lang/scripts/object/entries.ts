import type * as DString from "@scripts/string";
import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";

export type GetEntry<
	GenericKey extends DCommon.ObjectKey,
	GenericValue extends unknown,
> = GenericValue extends any
	? GenericKey extends string | number
		? [`${GenericKey}`, GenericValue]
		: never
	: never;

export type GetEntries<
	GenericObject extends object,
> = GenericObject extends readonly any[]
	? [DString.Number, GenericObject[number]][]
	: DCommon.IsEqual<GenericObject, object> extends true
		? [string, DCommon.AnyValue][]
		: (
			{
				[Prop in keyof GenericObject]-?: GetEntry<Prop, GenericObject[Prop]>
			}[keyof GenericObject]
		) extends infer InferredResult extends DCommon.ObjectEntry
			? DCommon.IsEqual<InferredResult, never> extends true
				? []
				: InferredResult[]
			: never;

export function entries<
	GenericObject extends object,
>(
	object: GenericObject,
): DCommon.SimplifyTopLevel<GetEntries<GenericObject>>;

export function entries(object: object) {
	const result: [key: unknown, value: unknown][] = [];

	for (const key in object) {
		if (!DKind.isRuntimeKey(key)) {
			result.push([key, object[key as never]]);
		}
	}

	return result;
}

/**
 * @deprecated Not ignore kind key.
 */
entries.unsafe = Object.entries;
