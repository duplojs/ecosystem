import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile, TESTImplementation, setEnvironment } from "@scripts";
import { createStatInfo } from "@tests/_utils/statInfo";

describe("size", () => {
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
			params: {
				min: 0,
				max: 100,
			},
			expected: {
				min: 0,
				max: 100,
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
	] as const)("creates a size constraint from $params", ({ params, expected }) => {
		const constraint = DSDataStructure.size(params);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.SizeConstraint,
			"strict"
		>;

		expect(DSDataStructure.sizeConstraintKind.has(constraint)).toBe(true);
		expect(constraint.definition).toStrictEqual(expected);
		expect(constraint.isAsynchronous()).toBe(true);
	});

	it.each([
		{
			sizeBytes: 1023,
			expected: false,
		},
		{
			sizeBytes: 1024,
			expected: true,
		},
		{
			sizeBytes: 2048,
			expected: true,
		},
		{
			sizeBytes: 2049,
			expected: false,
		},
	])("applies size bounds to a file of $sizeBytes bytes", async({ sizeBytes, expected }) => {
		setEnvironment("TEST");
		const stat = vi.fn<DSFile.FileInterface["stat"]>().mockResolvedValue(
			DEither.right("file-system-stat", createStatInfo({ sizeBytes })),
		);
		TESTImplementation.set("stat", stat);
		const structure = DSDataStructure.file([
			DSDataStructure.size({
				min: "1kb",
				max: "2kb",
			}),
		]);
		const file = DSFile.createFileInterface(DPath.declarePath("/tmp/example.txt"));

		const result = await structure.asyncCheck(file);

		expect(DEither.isRight(result)).toBe(expected);
		expect(stat).toHaveBeenCalledExactlyOnceWith(file.path);
	});
});
