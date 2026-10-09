import { IsNever } from './isNever';
import { Not } from './not';
export type HasSomething<GenericValue extends unknown> = Not<IsNever<GenericValue>>;
