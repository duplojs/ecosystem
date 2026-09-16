import type * as DCommon from "@duplojs/lang/common";
import type * as DKind from "@duplojs/lang/kind";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSFile from "@scripts/file";
import { createKind } from "../kind";

export const fileFundamentalTypeKind = createKind("file-fundamental-type");

export interface TheFile extends DCommon.UnionToIntersection<
	& DDataStructure.FundamentalType<DSFile.FileInterface>
	& DKind.Kind<typeof fileFundamentalTypeKind>
> {}

export const TheFile = DDataStructure.createFundamentalType<
	TheFile
>(
	fileFundamentalTypeKind,
	(self, data) => DSFile.isFileInterface(data)
		? DDataStructure.SuccessSymbol
		: DDataStructure.ErrorSymbol,
);
