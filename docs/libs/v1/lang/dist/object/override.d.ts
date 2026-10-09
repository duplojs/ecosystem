import type * as DCommon from '../common';
type OverrideParameter<GenericValue extends object> = DCommon.IsUnion<GenericValue> extends true ? undefined : Partial<GenericValue>;
export declare function override<GenericObject extends object>(value: OverrideParameter<GenericObject>): (object: GenericObject) => GenericObject;
export declare function override<GenericObject extends object>(object: GenericObject, value: OverrideParameter<GenericObject>): GenericObject;
export {};
