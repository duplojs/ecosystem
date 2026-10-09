import type * as DCommon from '../common';
export type Coalescing<GenericValue extends unknown> = GenericValue extends readonly any[] ? GenericValue : readonly [GenericValue];
export declare function coalescing<GenericValue extends DCommon.AnyValue>(value: GenericValue): Coalescing<GenericValue>;
