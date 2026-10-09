import { ApplyFormat, Format } from './constraints';
import { IsKeyPattern } from './types';
import type * as DCommon from '../common';
import type * as DNumber from '../number';
import type * as DArray from '../array';
import type * as DTuple from '../tuple';
export interface SplitParams<GenericLimit extends number> {
    limit: GenericLimit & DNumber.RequirePositiveInteger<GenericLimit>;
}
type CountSplitGroups<GenericString extends string, GenericSeparator extends string, GenericGroups extends readonly string[] = [string]> = GenericString extends `${string}${GenericSeparator}${infer InferredAfter}` ? DCommon.IsEqual<GenericGroups["length"], 100> extends true ? number : CountSplitGroups<InferredAfter, GenericSeparator, [
    ...GenericGroups,
    string
]> : GenericGroups["length"];
type ApplySplitLimit<GenericGroupNumber extends number, GenericLimit extends number> = DCommon.IsEqual<GenericLimit, number> extends true ? GenericGroupNumber : DTuple.Create<unknown, GenericGroupNumber> extends readonly [
    ...DTuple.Create<unknown, GenericLimit>,
    ...unknown[]
] ? GenericLimit : GenericGroupNumber;
type ComputeSplitOutput<GenericString extends string, GenericSeparator extends string, GenericLimit extends number> = DCommon.Or<[
    DCommon.IsEqual<GenericString, string>,
    DCommon.IsEqual<GenericSeparator, "">,
    IsKeyPattern<GenericSeparator>
]> extends true ? readonly string[] & DArray.MinElements<ApplySplitLimit<1, GenericLimit>> : CountSplitGroups<GenericString, GenericSeparator> extends infer InferredGroupNumber extends number ? ApplySplitLimit<InferredGroupNumber, GenericLimit> extends infer InferredOutputLength extends number ? (readonly string[] & DArray.MinElements<InferredOutputLength> & (IsKeyPattern<GenericString> extends true ? unknown : (DArray.LengthEqual<InferredOutputLength> & DArray.MaxElements<InferredOutputLength>))) : never : never;
type SplitOutput<GenericString extends string, GenericSeparator extends string, GenericLimit extends number = number> = GenericString extends Format<string> ? ComputeSplitOutput<Extract<DCommon.RemoveConstraint<ApplyFormat<GenericString>>, string>, GenericSeparator, GenericLimit> : ComputeSplitOutput<Extract<DCommon.RemoveConstraint<GenericString>, string>, GenericSeparator, GenericLimit>;
export declare function split<GenericString extends string, GenericSeparator extends string>(separator: GenericSeparator | RegExp): (string: GenericString) => SplitOutput<GenericString, GenericSeparator>;
export declare function split<GenericString extends string, GenericSeparator extends string, GenericLimit extends number>(string: GenericString, separator: GenericSeparator | RegExp, params?: SplitParams<GenericLimit>): SplitOutput<GenericString, GenericSeparator, GenericLimit>;
export {};
