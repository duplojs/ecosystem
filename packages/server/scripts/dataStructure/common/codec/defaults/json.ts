import * as DPath from "@duplojs/lang/path";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSFile from "@scripts/file";
import * as FundamentalType from "../../../fundamentalType";

export const codecsJson = DDataStructure.createCodecs({
	...DDataStructure.codecsJson.definition,
	file: DDataStructure.createCodec(
		FundamentalType.TheFile,
		(data) => typeof data === "string",
		(data) => data.path,
		(data) => {
			const result = DPath.normalize(data);
			if (!result) {
				return DDataStructure.ErrorSymbol;
			}
			return DSFile.createFileInterface(result);
		},
	),
	folder: DDataStructure.createCodec(
		FundamentalType.TheFolder,
		(data) => typeof data === "string",
		(data) => data.path,
		(data) => {
			const result = DPath.normalize(data);
			if (!result) {
				return DDataStructure.ErrorSymbol;
			}
			return DSFile.createFolderInterface(result);
		},
	),
});
