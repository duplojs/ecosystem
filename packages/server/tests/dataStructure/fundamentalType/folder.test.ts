import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure, DSFile } from "@scripts";

describe("TheFolder", () => {
	it("accepts folder interfaces", () => {
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/folder"));
		const stat = vi.spyOn(folder, "stat");
		const result = DSDataStructure.TheFolder.executeCheck(folder);

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DSDataStructure.TheFolder>,
			DSFile.FolderInterface,
			"strict"
		>;

		type _CheckStore = DCommon.ExpectType<
			DDataStructure.FundamentalTypesStore["serverFolder"],
			DSDataStructure.TheFolder,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DSDataStructure.folderFundamentalTypeKind.has(DSDataStructure.TheFolder)).toBe(true);
		expect(stat).not.toHaveBeenCalled();
	});

	it("rejects values that are not folder interfaces", () => {
		const file = DSFile.createFileInterface(DCommon.infer("/tmp/file.txt"));

		for (const value of [file, { path: "/tmp/folder" }, "/tmp/folder", null, undefined]) {
			expect(DSDataStructure.TheFolder.executeCheck(value)).toBe(DDataStructure.ErrorSymbol);
		}
	});
});
