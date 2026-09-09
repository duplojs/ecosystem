import type * as DCommon from "@scripts/common";

type CreateShape<
	GenericResult extends unknown,
	GenericProp extends keyof any,
> = GenericResult extends any
	? { [RemapProp in GenericProp]: GenericResult }
	: never;

export type Split<
	GenericValue extends unknown,
	GenericMax extends number = 10,
	GenericAccumulator extends readonly never[] = readonly [],
> = GenericValue extends unknown
	? DCommon.IsObject<GenericValue> extends true
		? GenericAccumulator["length"] extends GenericMax
			? GenericValue
			: {
				[Prop in keyof GenericValue]: DCommon.NeverCoalescing<
					CreateShape<
						Split<
							GenericValue[Prop],
							GenericMax,
							[...GenericAccumulator, never]
						>,
						Prop
					>,
					{ [RemapProp in Prop]: never }
				>
			}[keyof GenericValue]
		: GenericValue
	: never;
