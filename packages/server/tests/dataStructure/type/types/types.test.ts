import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure } from "@scripts";

describe("TypesStore", () => {
	it("registers the server file and folder types", () => {
		type _CheckStore = DCommon.ExpectType<
			Pick<DDataStructure.TypesStore, "serverFile" | "serverFolder">,
			{
				serverFile: DSDataStructure.FileType;
				serverFolder: DSDataStructure.FolderType;
			},
			"strict"
		>;

		type _CheckUnion = DCommon.ExpectType<
			Extract<DDataStructure.Types, DSDataStructure.FileType | DSDataStructure.FolderType>,
			DSDataStructure.FileType | DSDataStructure.FolderType,
			"strict"
		>;

		const types: Pick<DDataStructure.TypesStore, "serverFile" | "serverFolder"> = {
			serverFile: DSDataStructure.FileType(),
			serverFolder: DSDataStructure.FolderType(),
		};

		expect(DSDataStructure.fileTypeKind.has(types.serverFile)).toBe(true);
		expect(DSDataStructure.folderTypeKind.has(types.serverFolder)).toBe(true);
	});
});
