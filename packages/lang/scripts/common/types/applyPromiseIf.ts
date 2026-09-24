export type ApplyPromiseIf<
	GenericValue extends unknown,
	GenericBoolean extends boolean,
> = true extends GenericBoolean
	? Promise<GenericValue>
	: GenericValue;
