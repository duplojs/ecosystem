import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const nullFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/null-fundamental-type", unknown>>;
export interface TheNull extends DCommon.Forward<FundamentalType<null> & DKind.Kind<typeof nullFundamentalTypeKind>> {
}
export declare const TheNull: TheNull;
