import type * as DString from '../../string';
export type IsNegative<GenericValue extends number> = DString.Includes<`${GenericValue}`, "-">;
