import { AnyFunction } from './anyFunction';
import { MayBeGetter } from './maybeGetter';
export type UnwrapGetter<GenericGetter extends MayBeGetter<any>> = GenericGetter extends AnyFunction ? ReturnType<GenericGetter> : GenericGetter;
