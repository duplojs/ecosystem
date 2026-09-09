export interface CompatibilityConstraintResult<
	GenericResult extends boolean = boolean,
	GenericFrom extends unknown = unknown,
	GenericTo extends unknown = unknown,
> {
	result: GenericResult;
	from: GenericFrom;
	to: GenericTo;
}
