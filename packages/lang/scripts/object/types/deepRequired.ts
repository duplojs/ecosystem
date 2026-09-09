export type DeepRequired<
	GenericPattern extends object,
> = {
	[Prop in keyof GenericPattern]-?: GenericPattern[Prop] extends object
		? DeepRequired<GenericPattern[Prop]>
		: GenericPattern[Prop]
};
