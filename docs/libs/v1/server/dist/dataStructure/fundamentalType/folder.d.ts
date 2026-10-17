import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSFile from '../../file';
export declare const folderFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/folder-fundamental-type", unknown>>;
export interface TheFolder extends DCommon.UnionToIntersection<DDataStructure.FundamentalType<DSFile.FolderInterface> & DKind.Kind<typeof folderFundamentalTypeKind>> {
}
export declare const TheFolder: TheFolder;
