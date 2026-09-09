export type Values<
	GenericValue extends object,
> = GenericValue[keyof GenericValue];
