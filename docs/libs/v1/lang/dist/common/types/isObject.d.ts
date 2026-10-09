import { And } from './and';
import { IsExtends } from './IsExtends';
import { IsNever } from './isNever';
import { Not } from './not';
export type IsObject<GenericValue extends unknown> = And<[
    IsExtends<GenericValue, object>,
    Not<IsNever<keyof GenericValue>>
]>;
