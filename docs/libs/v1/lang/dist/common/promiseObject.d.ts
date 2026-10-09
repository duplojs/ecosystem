import { AnyValue, MaybePromise, SimplifyTopLevel } from './types';
export type AwaitedPromiseObject<GenericObject extends Record<string, MaybePromise<unknown>>> = {
    [Prop in keyof GenericObject]: Awaited<GenericObject[Prop]>;
};
export declare function promiseObject<GenericValue extends AnyValue, GenericObject extends Record<string, MaybePromise<GenericValue>>>(input: GenericObject): Promise<SimplifyTopLevel<AwaitedPromiseObject<GenericObject>>>;
