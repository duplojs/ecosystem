import { type IsNever } from "./isNever";
import { type Not } from "./not";

export type HasSomething<
	GenericValue extends unknown,
> = Not<IsNever<GenericValue>>;
