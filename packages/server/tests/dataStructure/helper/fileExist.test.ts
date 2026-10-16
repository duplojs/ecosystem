import type * as DCommon from "@duplojs/lang/common";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile, TESTImplementation, setEnvironment } from "@scripts";
import { createStatInfo } from "@tests/_utils/statInfo";

describe("fileExist", () => {
	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("creates a file existence constraint", () => {
		const constraint = DSDataStructure.fileExist();

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.FileExistConstraint,
			"strict"
		>;

		expect(DSDataStructure.fileExistConstraintKind.has(constraint)).toBe(true);
		expect(constraint.definition).toStrictEqual({});
		expect(constraint.isAsynchronous()).toBe(true);

		// @ts-expect-error File existence constraints require a FileInterface.
		DSDataStructure.folder([constraint]);
	});

	it.each([
		{
			isFile: true,
			expected: true,
		},
		{
			isFile: false,
			expected: false,
		},
	])("applies the constraint through a file structure ($isFile)", async({ isFile, expected }) => {
		setEnvironment("TEST");
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.right("file-system-stat", createStatInfo({ isFile })),
		);
		TESTImplementation.set("stat", stat);
		const structure = DSDataStructure.file([DSDataStructure.fileExist()]);
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.txt"));

		const result = await structure.asyncCheck(file);

		type _CheckValue = DCommon.ExpectType<
			DDataStructure.StructureValue<typeof structure>,
			DSFile.FileInterface,
			"strict"
		>;

		expect(DEither.isRight(result)).toBe(expected);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
	});
});
