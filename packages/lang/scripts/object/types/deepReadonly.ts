export type DeepReadonly<
	GenericValue extends object,
> = {
	readonly [Prop in keyof GenericValue]: GenericValue[Prop] extends object
		? DeepReadonly<GenericValue[Prop]>
		: GenericValue[Prop]
};
