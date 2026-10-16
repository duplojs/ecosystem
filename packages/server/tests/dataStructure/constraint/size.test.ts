import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile, TESTImplementation, setEnvironment } from "@scripts";
import { createStatInfo } from "@tests/_utils/statInfo";

describe("SizeConstraint", () => {
	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			params: {},
			expected: {
				min: undefined,
				max: undefined,
			},
		},
		{
			params: { min: 0 },
			expected: {
				min: 0,
				max: undefined,
			},
		},
		{
			params: { max: 0 },
			expected: {
				min: undefined,
				max: 0,
			},
		},
		{
			params: {
				min: 10,
				max: 20,
			},
			expected: {
				min: 10,
				max: 20,
			},
		},
		{
			params: {
				min: "1kb",
				max: "2kb",
			},
			expected: {
				min: 1024,
				max: 2048,
			},
		},
	] as const)("normalizes bounds $params", ({ params, expected }) => {
		const constraint = DSDataStructure.SizeConstraint(params);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.SizeConstraint,
			"strict"
		>;

		expect(constraint.definition).toStrictEqual(expected);
		expect(constraint.isAsynchronous()).toBe(true);
		expect(DSDataStructure.sizeConstraintKind.has(constraint)).toBe(true);
	});

	it.each([
		{
			params: {},
			sizeBytes: 0,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: {},
			sizeBytes: 10,
			isFile: false,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: { min: 10 },
			sizeBytes: 9,
			isFile: true,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: { min: 10 },
			sizeBytes: 10,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: { min: 10 },
			sizeBytes: 11,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: { max: 20 },
			sizeBytes: 19,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: { max: 20 },
			sizeBytes: 20,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: { max: 20 },
			sizeBytes: 21,
			isFile: true,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: {
				min: 10,
				max: 20,
			},
			sizeBytes: 10,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: {
				min: 10,
				max: 20,
			},
			sizeBytes: 20,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: {
				min: 10,
				max: 20,
			},
			sizeBytes: 9,
			isFile: true,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: {
				min: 10,
				max: 20,
			},
			sizeBytes: 21,
			isFile: true,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: {
				min: 0,
				max: 0,
			},
			sizeBytes: 0,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: { max: 0 },
			sizeBytes: 1,
			isFile: true,
			expected: DDataStructure.ErrorSymbol,
		},
		{
			params: {
				min: "1kb",
				max: "2kb",
			},
			sizeBytes: 1024,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
		{
			params: {
				min: "1kb",
				max: "2kb",
			},
			sizeBytes: 2048,
			isFile: true,
			expected: DDataStructure.SuccessSymbol,
		},
	] as const)("checks $sizeBytes bytes against $params (isFile: $isFile)", async({ params, sizeBytes, isFile, expected }) => {
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.txt"));
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.right("file-system-stat", createStatInfo({
				sizeBytes,
				isFile,
			})),
		);
		TESTImplementation.set("stat", stat);

		const result = await DSDataStructure.SizeConstraint(params).executeCheck(file);

		expect(result).toBe(expected);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
	});

	it("rejects files whose size cannot be read", async() => {
		class StatError extends DCommon.DuploJSError.parentClass("file-system-stat-error", Error) {}
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/missing"));
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.left("file-system-stat-error", new StatError(new Error("missing"))),
		);
		TESTImplementation.set("stat", stat);

		const result = await DSDataStructure.SizeConstraint({}).executeCheck(file);

		expect(result).toBe(DDataStructure.ErrorSymbol);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
	});
});
