import type { AnyFunction } from "./anyFunction";
import type { MayBeGetter } from "./maybeGetter";

export type UnwrapGetter<
	GenericGetter extends MayBeGetter<any>,
> = GenericGetter extends AnyFunction
	? ReturnType<GenericGetter>
	: GenericGetter;
