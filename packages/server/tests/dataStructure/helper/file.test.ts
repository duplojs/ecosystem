import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile } from "@scripts";

describe("file", () => {
	it("creates an unconstrained structure accepting file interfaces", () => {
		const structure = DSDataStructure.file();
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.txt"));
		const result = DEither.unwrapByInformationOrThrow(structure.check(file), "check-success");

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DSFile.FileInterface,
			"strict"
		>;

		type _CheckConstraints = DCommon.ExpectType<
			typeof structure.definition.constraints,
			readonly [],
			"strict"
		>;

		expect(result).toBe(file);
		expect(structure.definition.constraints).toStrictEqual([]);
		expect(DSDataStructure.fileTypeKind.has(structure.definition.type)).toBe(true);
	});

	it.each(["/tmp/example.txt", { path: "/tmp/example.txt" }, null, undefined])("rejects noninterfaces: %s", (input) => {
		const result = DSDataStructure.file().check(input);

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("rejects folder interfaces", () => {
		const folder = DSFile.createFolderInterface(DPath.declarePath("/tmp/folder"));
		const result = DSDataStructure.file().check(folder);

		expect(DEither.isLeft(result)).toBe(true);
	});

	it("preserves and applies compatible constraints", () => {
		const constraint = DDataStructure.refine<DSFile.FileInterface>(
			(file) => file.getName() === "allowed.txt",
		);
		const structure = DSDataStructure.file([constraint]);
		const allowed = DSFile.createFileInterface(DPath.declarePath("/tmp/allowed.txt"));
		const rejected = DSFile.createFileInterface(DPath.declarePath("/tmp/rejected.txt"));

		type _CheckConstraints = DCommon.ExpectType<
			typeof structure.definition.constraints,
			readonly [typeof constraint],
			"strict"
		>;

		expect(structure.definition.constraints[0]).toBe(constraint);
		expect(DEither.unwrapByInformationOrThrow(structure.check(allowed), "check-success")).toBe(allowed);
		expect(DEither.isLeft(structure.check(rejected))).toBe(true);

		// @ts-expect-error Folder constraints require a FolderInterface.
		DSDataStructure.file([DSDataStructure.folderExist()]);
		// @ts-expect-error String constraints cannot validate file interfaces.
		DSDataStructure.file([DDataStructure.minCharacters(1)]);
	});
});
