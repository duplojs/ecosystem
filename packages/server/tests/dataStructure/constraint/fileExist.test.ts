import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { DSDataStructure, DSFile, TESTImplementation, setEnvironment } from "@scripts";
import { createStatInfo } from "@tests/_utils/statInfo";

describe("FileExistConstraint", () => {
	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			isFile: false,
			expected: DDataStructure.ErrorSymbol,
		},
	])("checks whether an existing entry is a file ($isFile)", async({ isFile, expected }) => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.txt"));
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.right("file-system-stat", createStatInfo({ isFile })),
		);
		TESTImplementation.set("stat", stat);
		const constraint = DSDataStructure.FileExistConstraint();

		const result = await constraint.executeCheck(file);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.FileExistConstraint,
			"strict"
		>;

		expect(result).toBe(expected);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
		expect(constraint.isAsynchronous()).toBe(true);
		expect(DSDataStructure.fileExistConstraintKind.has(constraint)).toBe(true);
	});

	it("rejects files whose stat fails", async() => {
		class StatError extends DCommon.DuploJSError.parentClass("file-system-stat-error", Error) {}
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/missing"));
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.left("file-system-stat-error", new StatError(new Error("missing"))),
		);
		TESTImplementation.set("stat", stat);

		const result = await DSDataStructure.FileExistConstraint().executeCheck(file);

		expect(result).toBe(DDataStructure.ErrorSymbol);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
	});
});
