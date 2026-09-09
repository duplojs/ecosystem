import type { Constraint } from "./base";

export interface DynamicConstraint<
	GenericName extends string = string,
	GenericValue extends string | number = never,
> extends Constraint<
		GenericName,
		Record<GenericValue, unknown>
	> {

}
