import { type ComputedTypeError } from "./computedTypeError";

export type ForbiddenPromise<
	GenericValue extends unknown,
> = GenericValue extends Promise<any>
	? ComputedTypeError<"Promise value is forbidden.">
	: unknown;
