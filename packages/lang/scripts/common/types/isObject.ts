import { type And } from "./and";
import { type IsExtends } from "./IsExtends";
import { type IsNever } from "./isNever";
import { type Not } from "./not";

export type IsObject<
	GenericValue extends unknown,
> = And<[
	IsExtends<GenericValue, object>,
	Not<IsNever<keyof GenericValue>>,
]>;
