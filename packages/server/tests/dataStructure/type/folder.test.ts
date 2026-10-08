import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure, DSFile } from "@scripts";

describe("FolderType", () => {
	it("creates a synchronous type for folder interfaces", () => {
		const type = DSDataStructure.FolderType();
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/folder"));

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.TypeValue<typeof type>,
			DSFile.FolderInterface,
			"strict"
		>;

		type _CheckStore = DCommon.ExpectType<
			DDataStructure.TypesStore["serverFolder"],
			DSDataStructure.FolderType,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DSDataStructure.TheFolder);
		expect(DSDataStructure.folderTypeKind.has(type)).toBe(true);
		expect(type.executeCheck(folder)).toBe(DDataStructure.SuccessSymbol);
		expect(type.isAsynchronous()).toBe(false);
	});

	it("rejects values that are not folder interfaces", () => {
		const type = DSDataStructure.FolderType();
		const file = DSFile.createFileInterface(DCommon.infer("/tmp/file.txt"));

		for (const value of [file, { path: "/tmp/folder" }, "/tmp/folder", null, undefined]) {
			expect(type.executeCheck(value)).toBe(DDataStructure.ErrorSymbol);
		}
	});
});
