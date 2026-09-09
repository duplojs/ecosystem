import { DCommon, DPath, pipe, type ExpectType } from "@scripts";

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

		type _CheckResult = ExpectType<
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

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Path) | null,
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

		const result = pipe(
			path,
			DPath.getParentFolderPath,
		);

		expect(result).toBe("alpha");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Path) | null,
			"strict"
		>;
	});
});
