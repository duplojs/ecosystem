import type * as DCommon from '../common';
type IsOutput<GenericValue extends unknown> = DCommon.IsEqual<Extract<GenericValue, readonly unknown[]>, never> extends true ? GenericValue & readonly unknown[] : Extract<GenericValue, readonly unknown[]>;
export declare function is<GenericValue extends unknown>(value: GenericValue): value is IsOutput<GenericValue>;
export {};
