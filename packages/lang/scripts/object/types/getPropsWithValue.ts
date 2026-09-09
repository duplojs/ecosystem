import type * as DCommon from "@scripts/common";

export type GetPropsWithValue<
	GenericObject extends object,
	GenericValue extends unknown,
> = {
	[Prop in keyof GenericObject]-?:
	DCommon.IsEqual<
		GenericObject[Prop],
		GenericValue
	> extends true
		? Prop
		: never
}[keyof GenericObject];
