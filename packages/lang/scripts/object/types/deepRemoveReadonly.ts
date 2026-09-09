export type DeepRemoveReadonly<
	GenericValue extends unknown,
> = {
	readonly [Prop in keyof GenericValue]: GenericValue[Prop] extends object
		? DeepRemoveReadonly<GenericValue[Prop]>
		: GenericValue[Prop]
};
