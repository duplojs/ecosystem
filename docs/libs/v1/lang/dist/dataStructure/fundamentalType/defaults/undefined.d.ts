import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const undefinedFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/undefined-fundamental-type", unknown>>;
export interface TheUndefined extends DCommon.Forward<FundamentalType<undefined> & DKind.Kind<typeof undefinedFundamentalTypeKind>> {
}
export declare const TheUndefined: TheUndefined;
