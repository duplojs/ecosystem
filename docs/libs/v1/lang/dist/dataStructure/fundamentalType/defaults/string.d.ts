import { FundamentalType } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const stringFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/string-fundamental-type", unknown>>;
export interface TheString extends DCommon.Forward<FundamentalType<string> & DKind.Kind<typeof stringFundamentalTypeKind>> {
}
export declare const TheString: TheString;
