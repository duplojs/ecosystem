import { ExtractLengthEqual, LengthEqual } from '../lengthEqual';
import { ExtractMaxCharacters, MaxCharacters } from '../maxCharacters';
import { ExtractMinCharacters, MinCharacters } from '../minCharacters';
import { IsLiteral } from '../../types';
import type * as DCommon from '../../../common';
type ApplyLengthEqual<GenericOutput extends string, GenericSource extends string, GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual"> = "lengthEqual" extends GenericReapplyConstraint ? DCommon.Or<[
    DCommon.ContainExtends<GenericSource, LengthEqual<number>>,
    DCommon.Not<IsLiteral<GenericOutput>>
]> extends true ? ExtractLengthEqual<GenericSource, unknown> extends LengthEqual<infer InferredLength> ? (GenericOutput & DCommon.UnionToIntersection<InferredLength extends number ? LengthEqual<InferredLength> : never>) : GenericOutput : GenericOutput : GenericOutput;
type ApplyMinCharacters<GenericOutput extends string, GenericSource extends string, GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual"> = "minCharacters" extends GenericReapplyConstraint ? DCommon.Or<[
    DCommon.ContainExtends<GenericSource, MinCharacters<number>>,
    DCommon.And<[
        DCommon.Not<DCommon.ContainExtends<GenericOutput, LengthEqual<number>>>,
        DCommon.Not<IsLiteral<GenericOutput>>
    ]>
]> extends true ? ExtractMinCharacters<GenericSource, unknown> extends MinCharacters<infer InferredMin> ? (GenericOutput & DCommon.UnionToIntersection<InferredMin extends number ? MinCharacters<InferredMin> : never>) : GenericOutput : GenericOutput : GenericOutput;
type ApplyMaxCharacters<GenericOutput extends string, GenericSource extends string, GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual"> = "maxCharacters" extends GenericReapplyConstraint ? DCommon.Or<[
    DCommon.ContainExtends<GenericSource, MaxCharacters<number>>,
    DCommon.And<[
        DCommon.Not<DCommon.ContainExtends<GenericOutput, LengthEqual<number>>>,
        DCommon.Not<IsLiteral<GenericOutput>>
    ]>
]> extends true ? ExtractMaxCharacters<GenericSource, unknown> extends MaxCharacters<infer InferredMax> ? (GenericOutput & DCommon.UnionToIntersection<InferredMax extends number ? MaxCharacters<InferredMax> : never>) : GenericOutput : GenericOutput : GenericOutput;
export type ReapplyCompatiblesConstraints<GenericSource extends string, GenericOutput extends string, GenericReapplyConstraint extends "maxCharacters" | "minCharacters" | "lengthEqual" = "maxCharacters" | "minCharacters" | "lengthEqual"> = ApplyMaxCharacters<ApplyMinCharacters<ApplyLengthEqual<GenericOutput, GenericSource, GenericReapplyConstraint>, GenericSource, GenericReapplyConstraint>, GenericSource, GenericReapplyConstraint>;
export {};
