import type * as DCommon from '../common';
export declare function entry<GenericKey extends DCommon.ObjectKey, GenericValue extends unknown>(key: GenericKey, value: GenericValue): readonly [GenericKey, GenericValue];
