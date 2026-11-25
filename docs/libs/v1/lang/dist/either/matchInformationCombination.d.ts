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
type ComputeEntry<GenericCombination extends DCommon.AnyTuple<Right | Left>> = ComputeCombination<GenericCombination> extends infer InferredResult extends DCommon.AnyTuple<Right | Left> ? InferredResult extends unknown ? readonly [
    ComputeInformationCombination<InferredResult>,
    InferredResult
] : never : never;
type UnwrapCombination<GenericCombination extends DCommon.AnyTuple<Right | Left> | readonly (Right | Left)[]> = GenericCombination extends readonly [
    infer InferredFirst extends Right | Left,
    ...infer InferredRest extends readonly (Right | Left)[]
] ? readonly [GetValue<InferredFirst>, ...UnwrapCombination<InferredRest>] : readonly [];
type ComputeMatcher<GenericCombination extends DCommon.AnyTuple<Right | Left>> = ComputeEntry<GenericCombination> extends infer InferredResult extends readonly [
    string,
    DCommon.AnyTuple<Right | Left>
] ? {
    [Entry in InferredResult as Entry[0]]: (combination: UnwrapCombination<Entry[1]>) => unknown;
} : never;
type ForbiddenMoreKey<GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends ComputeMatcher<GenericCombination>> = DObject.ForbiddenKey<GenericMatcher, Extract<Exclude<keyof GenericMatcher, ComputeInformationCombination<GenericCombination>>, string>>;
export declare function matchInformationCombination<const GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends ComputeMatcher<GenericCombination>, GenericError extends ForbiddenMoreKey<GenericCombination, GenericMatcher>>(matcher: (ComputeMatcher<NoInfer<GenericCombination>> & GenericMatcher & NoInfer<GenericError>)): (combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>) => ReturnType<DObject.Values<NoInfer<GenericMatcher>>>;
export declare function matchInformationCombination<const GenericCombination extends DCommon.AnyTuple<Right | Left>, GenericMatcher extends ComputeMatcher<GenericCombination>>(combination: GenericCombination & NoInfer<RequireInformationCombination<GenericCombination>>, matcher: DCommon.FixDeepFunctionInfer<ComputeMatcher<GenericCombination>, GenericMatcher> & ForbiddenMoreKey<GenericCombination, GenericMatcher>): ReturnType<DObject.Values<GenericMatcher>>;
export {};
