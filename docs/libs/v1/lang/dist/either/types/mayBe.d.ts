import { None } from '../left';
import { Some } from '../right';
export type Maybe<GenericValue extends unknown> = (Some<GenericValue> | None);
