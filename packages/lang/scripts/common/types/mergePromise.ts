export type MergePromise<
	GenericValue extends unknown,
> = Promise<
	GenericValue extends Promise<any>
		? Awaited<GenericValue>
		: never
>;
