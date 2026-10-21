import * as DCommon from "@scripts/common";
import * as DPath from "@scripts/path";

describe("getParentFolderPath", () => {
	it("returns the parent folder for relative paths", () => {
		const firstPath: string & DPath.Path = DCommon.infer("alpha/beta/gamma");
		const secondPath: string & DPath.Path = DCommon.infer("alpha/beta");

		expect(DPath.getParentFolderPath(firstPath)).toBe("alpha/beta");
		expect(DPath.getParentFolderPath(secondPath)).toBe("alpha");
	});

	it.each([
		["alpha", "."],
		[".git", "."],
		["...", "."],
		[".", ".."],
		["..", "../.."],
		["../..", "../../.."],
		["../../..", "../../../.."],
		["../alpha", ".."],
		["../../alpha", "../.."],
		["../...", ".."],
	] as const)("returns the relative parent of %s", (value, expected) => {
		const path: string & DPath.Path = DCommon.infer(value);

		expect(DPath.getParentFolderPath(path)).toBe(expected);
	});

	it("returns the parent folder for absolute paths", () => {
		const firstPath: string & DPath.Path = DCommon.infer("/alpha/beta");
		const secondPath: string & DPath.Path = DCommon.infer("/alpha");
		const dotOnlySegmentPath: string & DPath.Path = DCommon.infer("/...");

		expect(DPath.getParentFolderPath(firstPath)).toBe("/alpha");
		expect(DPath.getParentFolderPath(secondPath)).toBe("/");
		expect(DPath.getParentFolderPath(dotOnlySegmentPath)).toBe("/");
	});

	it("returns null for the absolute root", () => {
		const path: string & DPath.Path = DCommon.infer("/");

		expect(DPath.getParentFolderPath(path)).toBeNull();
	});

	it.each([
		["alpha\n/beta", "alpha\n"],
		["alpha\r/beta", "alpha\r"],
		["alpha\u2028/beta", "alpha\u2028"],
		["alpha\u2029/beta", "alpha\u2029"],
	] as const)("preserves a valid line terminator in the parent of %j", (value, expected) => {
		const path: string & DPath.Path = DCommon.infer(value);

		expect(DPath.getParentFolderPath(path)).toBe(expected);
	});

	it("narrows the output when the input is a path", () => {
		const path: string & DPath.Path = DCommon.infer("alpha/beta/gamma");

		const result = DPath.getParentFolderPath(path);

		expect(result).toBe("alpha/beta");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});

	it("narrows the output when the input is an absolute path", () => {
		const path: string & DPath.Path & DPath.Absolute = DCommon.infer(
			"/alpha/beta/gamma",
		);

		const result = DPath.getParentFolderPath(path);

		expect(result).toBe("/alpha/beta");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path & DPath.Absolute) | null,
			"strict"
		>;
	});

	it("requires a path input", () => {
		const path = "alpha/beta" as string;

		// @ts-expect-error path must be validated before extraction.
		DPath.getParentFolderPath(path);
	});

	it("can be used directly in a pipe", () => {
		const path: string & DPath.Path = DCommon.infer("alpha/beta");

		const result = DCommon.pipe(
			path,
			DPath.getParentFolderPath,
		);

		expect(result).toBe("alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});

	it.each([
		{
			input: "/alpha/beta",
			expected: "/alpha",
		},
		{
			input: "/alpha",
			expected: "/",
		},
		{
			input: "/",
			expected: null,
		},
	] as const)("preserves the absolute constraint for $input without a path constraint", ({ input, expected }) => {
		const path: string & DPath.Absolute = DCommon.infer(input);
		const result = DPath.getParentFolderPath(path);

		expect(result).toBe(expected);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path & DPath.Absolute) | null,
			"strict"
		>;
	});

	it("preserves the absolute constraint in a pipe", () => {
		const path: string & DPath.Absolute = DCommon.infer("/alpha/beta");
		const result = DCommon.pipe(path, DPath.getParentFolderPath);

		expect(result).toBe("/alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path & DPath.Absolute) | null,
			"strict"
		>;
	});

	it("does not guarantee an absolute parent for a union of path constraints", () => {
		const path = DPath.declarePath("alpha/beta") as string & (DPath.Path | DPath.Absolute);
		const result = DPath.getParentFolderPath(path);

		expect(result).toBe("alpha");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});
});
