import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSFile from '../../file';
export declare const fileFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/file-fundamental-type", unknown>>;
export interface TheFile extends DCommon.UnionToIntersection<DDataStructure.FundamentalType<DSFile.FileInterface> & DKind.Kind<typeof fileFundamentalTypeKind>> {
}
export declare const TheFile: TheFile;
