import * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSDataStructure, DSFile } from "@scripts";

describe("folderExist", () => {
	it("creates a folder existence constraint", () => {
		const constraint = DSDataStructure.folderExist();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.FolderExistConstraint,
			"strict"
		>;

		expect(DSDataStructure.folderExistConstraintKind.has(constraint)).toBe(true);
		expect(constraint.isAsynchronous()).toBe(true);

		// @ts-expect-error Folder existence constraints require a FolderInterface.
		DSDataStructure.file([constraint]);
	});

	it("validates folder existence through a folder structure", async() => {
		const structure = DSDataStructure.folder([DSDataStructure.folderExist()]);
		const folder = DSFile.createFolderInterface(DCommon.infer("/tmp/folder"));
		folder.stat = vi.fn()
			.mockResolvedValueOnce(DEither.success({ isDirectory: true }))
			.mockResolvedValueOnce(DEither.success({ isDirectory: false }))
			.mockResolvedValueOnce(DEither.left("file-system-stat", new Error("missing")));

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DSFile.FolderInterface,
			"strict"
		>;

		expect(DEither.unwrapRight(await structure.asyncCheck(folder))).toBe(folder);
		expect(DEither.isLeft(await structure.asyncCheck(folder))).toBe(true);
		expect(DEither.isLeft(await structure.asyncCheck(folder))).toBe(true);
	});
});
