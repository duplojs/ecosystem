import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure, DSFile } from "@scripts";

describe("FileType", () => {
	it("creates a synchronous type for file interfaces", () => {
		const type = DSDataStructure.FileType();
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file"));

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.TypeValue<typeof type>,
			DSFile.FileInterface,
			"strict"
		>;

		type _CheckStore = DCommon.ExpectType<
			DDataStructure.TypesStore["serverFile"],
			DSDataStructure.FileType,
			"strict"
		>;

		expect(type.fundamentalType).toBe(DSDataStructure.TheFile);
		expect(DSDataStructure.fileTypeKind.has(type)).toBe(true);
		expect(type.executeCheck(file)).toBe(DDataStructure.SuccessSymbol);
		expect(type.isAsynchronous()).toBe(false);
	});

	it("rejects values that are not file interfaces", () => {
		const type = DSDataStructure.FileType();
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));

		for (const value of [folder, { path: "/tmp/file" }, "/tmp/file", null, undefined]) {
			expect(type.executeCheck(value)).toBe(DDataStructure.ErrorSymbol);
		}
	});
});
