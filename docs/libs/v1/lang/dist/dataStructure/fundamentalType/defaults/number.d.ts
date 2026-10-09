import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const numberFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/number-fundamental-type", unknown>>;
export interface TheNumber extends DCommon.Forward<FundamentalType<number> & DKind.Kind<typeof numberFundamentalTypeKind>> {
}
export declare const TheNumber: TheNumber;
