import * as DPath from "@duplojs/lang/path";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSDataStructure, DSFile } from "@scripts";

describe("folder", () => {
	it("creates a structure accepting folder interfaces", () => {
		const structure = DSDataStructure.folder();
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));
		const result = structure.check(folder);

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DSFile.FolderInterface,
			"strict"
		>;

		expect(DEither.unwrapRight(result)).toBe(folder);
		expect(DEither.isLeft(structure.check({ path: "/tmp/folder" }))).toBe(true);
		expect(DEither.isLeft(structure.check(
			DSFile.createFileInterface(DPath.declarePath("/tmp/file.txt")),
		))).toBe(true);
	});

	it("preserves and applies constraints compatible with folder interfaces", () => {
		const constraint = DDataStructure.refine<DSFile.FolderInterface>(
			(folder) => folder.getName() === "allowed",
		);
		const structure = DSDataStructure.folder([constraint]);

		type _CheckConstraints = DCommon.ExpectType<
			typeof structure.definition.constraints,
			readonly [typeof constraint],
			"strict"
		>;

		expect(DEither.isRight(structure.check(
			DSFile.createFolderInterface(DPath.declarePath("/tmp/allowed")),
		))).toBe(true);
		expect(DEither.isLeft(structure.check(
			DSFile.createFolderInterface(DPath.declarePath("/tmp/rejected")),
		))).toBe(true);

		// @ts-expect-error File existence constraints require a FileInterface.
		DSDataStructure.folder([DSDataStructure.fileExist()]);
	});
});
