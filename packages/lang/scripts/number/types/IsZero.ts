
export type IsZero<
	GenericInput extends number,
> = (
	GenericInput extends 0
		? true
		: false
) extends true
	? true
	: false;
