import { type Constraint } from "./base";

export type MaybeConstrain<
	GenericValue extends unknown,
> = (
	| GenericValue
	| (GenericValue & Constraint)
);
