import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSDataStructure, DSFile } from "@scripts";

describe("FolderExistConstraint", () => {
	it("accepts existing directories asynchronously", async() => {
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/folder"));
		folder.stat = vi.fn().mockResolvedValue(DEither.success({ isDirectory: true }));
		const constraint = DSDataStructure.FolderExistConstraint();

		type _CheckStore = DCommon.ExpectType<
			DDataStructure.ConstraintsStore["folderExist"],
			DSDataStructure.FolderExistConstraint,
			"strict"
		>;

		expect(await constraint.executeCheck(folder)).toBe(DDataStructure.SuccessSymbol);
		expect(folder.stat).toHaveBeenCalledOnce();
		expect(constraint.isAsynchronous()).toBe(true);
		expect(DSDataStructure.folderExistConstraintKind.has(constraint)).toBe(true);
	});

	it("rejects entries that are not directories", async() => {
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/file.txt"));
		folder.stat = vi.fn().mockResolvedValue(DEither.success({
			isDirectory: false,
			isFile: true,
		}));

		expect(await DSDataStructure.FolderExistConstraint().executeCheck(folder)).toBe(DDataStructure.ErrorSymbol);
	});

	it("rejects folders whose stat fails", async() => {
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/missing"));
		folder.stat = vi.fn().mockResolvedValue(DEither.left("file-system-stat", new Error("missing")));

		expect(await DSDataStructure.FolderExistConstraint().executeCheck(folder)).toBe(DDataStructure.ErrorSymbol);
	});
});
