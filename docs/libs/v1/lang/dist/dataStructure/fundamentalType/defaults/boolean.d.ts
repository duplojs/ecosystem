import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const booleanFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/boolean-fundamental-type", unknown>>;
export interface TheBoolean extends DCommon.Forward<FundamentalType<boolean> & DKind.Kind<typeof booleanFundamentalTypeKind>> {
}
export declare const TheBoolean: TheBoolean;
