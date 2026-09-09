import { type IsNever } from "./isNever";

export type FixDeepFunctionInfer<
	GenericValue extends unknown,
	GenericValueInfer extends unknown,
> = IsNever<GenericValueInfer> extends true
	? NoInfer<GenericValue>
	: GenericValueInfer;
