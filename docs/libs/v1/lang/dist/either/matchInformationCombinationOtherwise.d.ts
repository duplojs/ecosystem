import { Left } from './left';
import { Right } from './right';
import { GetValue, GetInformation, RequireInformationCombination } from './types';
import type * as DCommon from '../common';
import type * as DObject from '../object';
type ComputeCombination<GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[]> = GenericCombination extends readonly [
    infer InferredFirst,
    ...infer InferredRest extends readonly (Right | Left)[]
] ? InferredFirst extends unknown ? ComputeCombination<InferredRest> extends infer InferredResult extends readonly (Right | Left)[] ? InferredResult extends unknown ? readonly [InferredFirst, ...InferredResult] : never : never : never : readonly [];
type ComputeInformationCombination<GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[]> = GenericCombination extends readonly [
    infer InferredFirst extends Right | Left,
    ...infer InferredRest extends readonly (Right | Left)[]
] ? ComputeInformationCombination<InferredRest> extends infer InferredResult extends string ? DCommon.IsNever<InferredResult> extends true ? GetInformation<InferredFirst> : `${GetInformation<InferredFirst>}/${InferredResult}` : never : never;
type ComputeEntry<GenericCombination extends DCommon.AnyTuple<Right | Left>> = (ComputeCombination<GenericCombination> extends infer InferredResult extends DCommon.AnyTuple<Right | Left> ? InferredResult extends unknown ? readonly [
    ComputeInformationCombination<InferredResult>,
    InferredResult
] : never : never);
type UnwrapCombination<GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[]> = GenericCombination extends readonly [
    infer InferredFirst extends Right | Left,
    ...infer InferredRest extends readonly (Right | Left)[]
] ? readonly [GetValue<InferredFirst>, ...UnwrapCombination<InferredRest>] : readonly [];
type ComputeMatcher<GenericCombination extends DCommon.AnyTuple<Right | Left>> = Extract<ComputeEntry<GenericCombination> extends infer InferredResult extends readonly [
    string,
    DCommon.AnyTuple<Right | Left>
] ? {
    [Entry in InferredResult as Entry[0]]?: (combination: UnwrapCombination<Entry[1]>) => unknown;
} : never, any>;
type ForbiddenMoreKey<GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends object> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, ComputeInformationCombination<GenericCombination>>, string>>;
type ComputeOtherwise<GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends object> = ComputeEntry<GenericCombination> extends infer InferredEntry extends readonly [
    string,
    DCommon.AnyTuple<Right | Left>
] ? InferredEntry extends unknown ? InferredEntry[0] extends DObject.GetPropsWithValueExtends<GenericMatcher, DCommon.AnyFunction> ? never : InferredEntry[1] : never : never;
export declare function matchInformationCombinationOtherwise<const GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends object, GenericOutput extends unknown, GenericError extends (ForbiddenMoreKey<GenericCombination, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>)>(matcher: (NoInfer<ComputeMatcher<GenericCombination>> & GenericMatcher & NoInfer<GenericError>), otherwise: (combination: NoInfer<ComputeOtherwise<GenericCombination, GenericMatcher>>) => GenericOutput): (combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>) => (ReturnType<Extract<DObject.Values<NoInfer<GenericMatcher>>, DCommon.AnyFunction>> | GenericOutput);
export declare function matchInformationCombinationOtherwise<const GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends object, GenericOutput extends unknown, GenericError extends (ForbiddenMoreKey<GenericCombination, GenericMatcher> & DObject.ForbiddenUndefinedProps<GenericMatcher>)>(combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>, matcher: (NoInfer<ComputeMatcher<GenericCombination>> & GenericMatcher & NoInfer<GenericError>), otherwise: (combination: NoInfer<ComputeOtherwise<GenericCombination, GenericMatcher>>) => GenericOutput): (ReturnType<Extract<DObject.Values<NoInfer<GenericMatcher>>, DCommon.AnyFunction>> | GenericOutput);
export {};
