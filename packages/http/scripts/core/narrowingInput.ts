import type * as DCommon from "@duplojs/lang/common";

export interface NarrowingInput<
	GenericKey extends DCommon.ObjectKey = DCommon.ObjectKey,
	GenericValue extends unknown = unknown,
> {
	inputName: GenericKey;
	value: GenericValue;
}

export type ShrinkerInput<
	GenericDefinition extends object = object,
> = DCommon.SimplifyTopLevel<{
	[DPattern in keyof GenericDefinition]: (
		value: GenericDefinition[DPattern],
	) => NarrowingInput<DPattern, GenericDefinition[DPattern]>
}>;

export type GetNarrowingInput<
	GenericInput extends ShrinkerInput,
	GenericKey extends keyof GenericInput = keyof GenericInput,
> = ReturnType<
	GenericInput[GenericKey] extends DCommon.AnyFunction ? GenericInput[GenericKey] : never
>;

export function createNarrowingInput<
	GenericDefinition extends object,
>(): ShrinkerInput<GenericDefinition> {
	return new Proxy<
		Record<DCommon.ObjectKey, DCommon.AnyFunction>
	>(
		{},
		{
			get(target, name: string) {
				return (
					target[name] ||= (value): NarrowingInput => ({
						inputName: name,
						value,
					})
				);
			},
		},
	) as any;
}
