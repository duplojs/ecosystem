import { RemoveConstraint } from './types';
export declare function removeConstraint<GenericValue extends unknown>(value: GenericValue): GenericValue extends unknown ? RemoveConstraint<GenericValue> : never;
