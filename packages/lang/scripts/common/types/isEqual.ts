export type IsEqual<
	GenericLeft extends unknown,
	GenericRight extends unknown,
> = (
	<GenericValue>() => GenericValue extends GenericLeft ? 1 : 2
) extends (
	<GenericValue>() => GenericValue extends GenericRight ? 1 : 2
)
	? true
	: false;

export type IsEqualFlexible<
	GenericLeft extends unknown,
	GenericRight extends unknown,
> = (
	[(arg: GenericRight) => void] extends [(arg: GenericLeft) => void]
		? [(arg: GenericLeft) => void] extends [(arg: GenericRight) => void]
			? true
			: false
		: false
);
