import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure } from "@scripts";

describe("FundamentalTypesStore", () => {
	it("registers the server file and folder fundamental types", () => {
		type _CheckStore = DCommon.ExpectType<
			Pick<DDataStructure.FundamentalTypesStore, "serverFile" | "serverFolder">,
			{
				serverFile: DSDataStructure.TheFile;
				serverFolder: DSDataStructure.TheFolder;
			},
			"strict"
		>;

		type _CheckUnion = DCommon.ExpectType<
			Extract<DDataStructure.FundamentalTypes, DSDataStructure.TheFile | DSDataStructure.TheFolder>,
			DSDataStructure.TheFile | DSDataStructure.TheFolder,
			"strict"
		>;

		const types: Pick<DDataStructure.FundamentalTypesStore, "serverFile" | "serverFolder"> = {
			serverFile: DSDataStructure.TheFile,
			serverFolder: DSDataStructure.TheFolder,
		};

		expect(DSDataStructure.fileFundamentalTypeKind.has(types.serverFile)).toBe(true);
		expect(DSDataStructure.folderFundamentalTypeKind.has(types.serverFolder)).toBe(true);
	});
});
