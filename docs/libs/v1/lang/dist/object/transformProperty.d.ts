import type * as DCommon from '../common';
type TransformPropertyOutput<GenericObject extends object, GenericKey extends keyof GenericObject, GenericNewValue extends unknown> = DCommon.SimplifyTopLevel<{
    [Prop in GenericKey]: GenericNewValue;
} & Omit<GenericObject, GenericKey>>;
export declare function transformProperty<GenericObject extends object, GenericKey extends keyof GenericObject, GenericNewValue extends unknown>(key: GenericKey, transform: (value: GenericObject[GenericKey]) => GenericNewValue): (object: GenericObject) => TransformPropertyOutput<GenericObject, GenericKey, GenericNewValue>;
export declare function transformProperty<GenericObject extends object, GenericKey extends keyof GenericObject, GenericNewValue extends unknown>(object: GenericObject, key: GenericKey, transform: (value: GenericObject[GenericKey]) => GenericNewValue): TransformPropertyOutput<GenericObject, GenericKey, GenericNewValue>;
export {};
