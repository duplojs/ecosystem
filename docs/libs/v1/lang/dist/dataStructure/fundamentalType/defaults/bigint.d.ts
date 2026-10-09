import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const bigintFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/bigint-fundamental-type", unknown>>;
export interface TheBigint extends DCommon.Forward<FundamentalType<bigint> & DKind.Kind<typeof bigintFundamentalTypeKind>> {
}
export declare const TheBigint: TheBigint;
