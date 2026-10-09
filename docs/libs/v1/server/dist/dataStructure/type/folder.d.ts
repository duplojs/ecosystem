import type * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DSFile from '../../file';
import * as FundamentalType from "../fundamentalType";
export declare const folderTypeKind: DKind.Handler<DKind.Definition<"@DuplojsServerDataStructure/folder-type", unknown>>;
export interface FolderTypeDefinition extends DDataStructure.TypeDefinition {
}
export interface FolderType extends DCommon.UnionToIntersection<DDataStructure.Type<FundamentalType.TheFolder, DSFile.FolderInterface, FolderTypeDefinition> & DKind.Kind<typeof folderTypeKind>> {
}
export declare const FolderType: () => FolderType;
