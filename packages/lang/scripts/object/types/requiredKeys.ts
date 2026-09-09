import type * as DCommon from "@scripts/common";

export type RequiredKeys<
	GenericObject extends object,
	GenericKeys extends keyof GenericObject = keyof GenericObject,
> = DCommon.SimplifyTopLevel<
	Required<
		Pick<GenericObject, GenericKeys>
	>
	& GenericObject
>;
