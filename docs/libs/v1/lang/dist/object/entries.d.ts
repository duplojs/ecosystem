import type * as DString from '../string';
import type * as DCommon from '../common';
export type GetEntry<GenericKey extends DCommon.ObjectKey, GenericValue extends unknown> = GenericValue extends any ? GenericKey extends string | number ? readonly [`${GenericKey}`, GenericValue] : never : never;
export type GetEntries<GenericObject extends object> = GenericObject extends readonly any[] ? readonly (readonly [DString.Number, GenericObject[number]])[] : DCommon.IsEqual<GenericObject, object> extends true ? readonly [string, DCommon.AnyValue][] : ({
    [Prop in keyof GenericObject]-?: GetEntry<Prop, GenericObject[Prop]>;
}[keyof GenericObject]) extends infer InferredResult extends DCommon.ObjectEntry ? DCommon.IsEqual<InferredResult, never> extends true ? readonly [] : readonly InferredResult[] : never;
export declare function entries<GenericObject extends object>(object: GenericObject): DCommon.SimplifyTopLevel<GetEntries<GenericObject>>;
export declare namespace entries {
    var unsafe: {
        <T>(o: {
            [s: string]: T;
        } | ArrayLike<T>): [string, T][];
        (o: {}): [string, any][];
    };
}
