import { MaybePromise } from './types';
export interface MemoizedPromise<GenericValue extends unknown> {
    readonly value: MaybePromise<GenericValue>;
}
export declare function memoPromise<GenericOutput extends unknown>(getter: () => MaybePromise<GenericOutput>): MemoizedPromise<GenericOutput>;
