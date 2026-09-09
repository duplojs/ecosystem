export declare const ConstraintSymbol: unique symbol;
export type ConstraintSymbol = typeof ConstraintSymbol;

export interface BaseConstraint<
	GenericValue extends Record<string, unknown> = Record<string, unknown>,
> {
	[ConstraintSymbol]: GenericValue;
}

export interface Constraint<
	GenericName extends string = string,
	GenericValue extends unknown = unknown,
> extends BaseConstraint<
		Record<GenericName, GenericValue>
	> {
}
