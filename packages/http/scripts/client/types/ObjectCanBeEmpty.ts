import type * as DCommon from "@duplojs/lang/common";

export type ObjectCanBeEmpty<
	GenericObject extends object,
> = DCommon.IsEqual<
	{
		[Prop in keyof GenericObject]-?: undefined extends GenericObject[Prop]
			? true
			: false
	}[keyof GenericObject],
	true
>;
