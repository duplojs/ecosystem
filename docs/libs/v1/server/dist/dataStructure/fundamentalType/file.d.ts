import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DSFile from '../../file';
export declare const fileFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/file-fundamental-type", unknown>>;
export interface TheFile extends DCommon.UnionToIntersection<DDataStructure.FundamentalType<DSFile.FileInterface> & DKind.Kind<typeof fileFundamentalTypeKind>> {
}
export declare const TheFile: TheFile;
