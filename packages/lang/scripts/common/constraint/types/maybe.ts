import { type Constraint } from "./base";

export type MaybeConstraint<
	GenericValue extends unknown,
> = (
	| GenericValue
	| (GenericValue & Constraint)
);
