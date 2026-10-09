import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DSFile from '../../file';
export declare const folderFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/folder-fundamental-type", unknown>>;
export interface TheFolder extends DCommon.UnionToIntersection<DDataStructure.FundamentalType<DSFile.FolderInterface> & DKind.Kind<typeof folderFundamentalTypeKind>> {
}
export declare const TheFolder: TheFolder;
