import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import { DSDataStructure, DSFile } from "@scripts";

describe("TheFile", () => {
	it("accepts file interfaces", () => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/file"));
		const stat = vi.spyOn(file, "stat");
		const result = DSDataStructure.TheFile.executeCheck(file);

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.FundamentalTypeValue<typeof DSDataStructure.TheFile>,
			DSFile.FileInterface,
			"strict"
		>;

		type _CheckStore = DCommon.ExpectType<
			DDataStructure.FundamentalTypesStore["serverFile"],
			DSDataStructure.TheFile,
			"strict"
		>;

		expect(result).toBe(DDataStructure.SuccessSymbol);
		expect(DSDataStructure.fileFundamentalTypeKind.has(DSDataStructure.TheFile)).toBe(true);
		expect(stat).not.toHaveBeenCalled();
	});

	it("rejects values that are not file interfaces", () => {
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));

		for (const value of [folder, { path: "/tmp/file" }, "/tmp/file", null, undefined]) {
			expect(DSDataStructure.TheFile.executeCheck(value)).toBe(DDataStructure.ErrorSymbol);
		}
	});
});
