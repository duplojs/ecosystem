import type * as DCommon from '../common';
export declare function values<GenericObject extends Record<string, DCommon.AnyValue>>(object: GenericObject): readonly GenericObject[keyof GenericObject][];
