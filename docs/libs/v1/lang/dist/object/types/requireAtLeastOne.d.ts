import type * as DCommon from '../../common';
export type RequireAtLeastOne<GenericObject extends object, GenericKeys extends keyof GenericObject = keyof GenericObject> = DCommon.IsEqual<Extract<keyof GenericObject, GenericKeys>, never> extends true ? (DCommon.ComputedTypeError<"requires at least one key."> & DCommon.ComputedTypeError<`one of keys: ${Extract<GenericKeys, string>}`>) : unknown;
