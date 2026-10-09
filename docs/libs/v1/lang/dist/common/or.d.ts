import { AnyPredicate, AnyFunction, IsEqual } from './types';
type ExtractPredicate<GenericPredicateList extends readonly AnyFunction<any[], boolean>[]> = GenericPredicateList extends readonly [
    (input: any, ...args: any[]) => input is infer InferredPredicate,
    ...infer InferredRest extends readonly AnyPredicate[]
] ? InferredRest extends readonly [] ? InferredPredicate : ExtractPredicate<InferredRest> extends infer InferredResult ? IsEqual<InferredResult, never> extends true ? never : InferredPredicate | InferredResult : never : never;
export declare function or<GenericInput extends unknown, const GenericPredicateList extends readonly [
    (input: GenericInput) => input is any,
    (input: GenericInput) => input is any,
    ...((input: GenericInput) => input is any)[]
]>(predicateList: GenericPredicateList): (input: GenericInput) => input is Extract<GenericInput, ExtractPredicate<GenericPredicateList>>;
export declare function or<GenericInput extends unknown>(predicateList: [
    (input: GenericInput) => boolean,
    (input: GenericInput) => boolean,
    ...((input: GenericInput) => boolean)[]
]): (input: GenericInput) => boolean;
export declare function or<GenericInput extends unknown, const GenericPredicateList extends readonly [
    (input: GenericInput) => input is any,
    (input: GenericInput) => input is any,
    ...((input: GenericInput) => input is any)[]
]>(input: GenericInput, predicateList: GenericPredicateList): input is Extract<GenericInput, ExtractPredicate<GenericPredicateList>>;
export declare function or<GenericInput extends unknown>(input: GenericInput, predicateList: [
    (input: GenericInput) => boolean,
    (input: GenericInput) => boolean,
    ...((input: GenericInput) => boolean)[]
]): boolean;
export {};
