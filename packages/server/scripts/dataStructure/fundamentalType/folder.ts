import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSFile from "@scripts/file";
import { createKind } from "../kind";

export const folderFundamentalTypeKind = createKind("folder-fundamental-type");

export interface TheFolder extends DCommon.UnionToIntersection<
	& DDataStructure.FundamentalType<DSFile.FolderInterface>
	& DKind.Kind<typeof folderFundamentalTypeKind>
> {}

export const TheFolder = DDataStructure.createFundamentalType<
	TheFolder
>(
	folderFundamentalTypeKind,
	(self, data) => DSFile.isFolderInterface(data)
		? DDataStructure.SuccessSymbol
		: DDataStructure.ErrorSymbol,
);
