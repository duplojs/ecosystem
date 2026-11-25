import { Handler, Kind } from '../base';
export type Maybe<GenericValue extends unknown> = (GenericValue | (GenericValue & Kind<Handler>));
