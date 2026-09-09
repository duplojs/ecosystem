export type IsExtends<
	GenericValueA extends unknown,
	GenericValueB extends unknown,
> = Extract<GenericValueA, any> extends GenericValueB
	? true
	: false;

export type ContainExtends<
	GenericValueA extends unknown,
	GenericValueB extends unknown,
> = (
	GenericValueA extends GenericValueB
		? true
		: false
) extends false
	? false
	: true;
