import { DCommon, DPath, pipe, type ExpectType } from "@scripts";

describe("getBaseName", () => {
	it("returns the base name of paths", () => {
		const firstPath: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");
		const secondPath: string & DPath.Path = DCommon.infer("beta/file.txt");
		const thirdPath: string & DPath.Path = DCommon.infer("file.txt");

		expect(DPath.getBaseName(firstPath)).toBe("file.txt");
		expect(DPath.getBaseName(secondPath)).toBe("file.txt");
		expect(DPath.getBaseName(thirdPath)).toBe("file.txt");
	});

	it("removes the extension when requested", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		expect(
			DPath.getBaseName(path, { removeExtension: true }),
		).toBe("file");
		expect(
			DPath.getBaseName(path, { removeExtension: false }),
		).toBe("file.txt");
	});

	it("returns null for root paths", () => {
		const path: string & DPath.Path = DCommon.infer("/");

		expect(DPath.getBaseName(path)).toBeNull();
	});

	it("returns null when the base name is not a segment", () => {
		const currentFolder: string & DPath.Path = DCommon.infer(".");
		const parentFolder: string & DPath.Path = DCommon.infer("..");
		const nestedParentFolder: string & DPath.Path = DCommon.infer("../..");

		expect(DPath.getBaseName(currentFolder)).toBeNull();
		expect(DPath.getBaseName(parentFolder)).toBeNull();
		expect(DPath.getBaseName(nestedParentFolder)).toBeNull();
	});

	it("returns null when removing the extension produces an invalid segment", () => {
		const currentFolderResult = DPath.getBaseName(
			DCommon.infer("..config") satisfies string & DPath.Segment,
			{ removeExtension: true },
		);
		const parentFolderResult = DPath.getBaseName(
			DCommon.infer("...config") satisfies string & DPath.Segment,
			{ removeExtension: true },
		);

		expect(currentFolderResult).toBeNull();
		expect(parentFolderResult).toBeNull();
	});

	it("accepts a segment and preserves the segment guarantee", () => {
		const segment: string & DPath.Segment = DCommon.infer("file.txt");

		const result = DPath.getBaseName(segment);

		expect(result).toBe("file.txt");
		expect(DPath.isSegment(result as string)).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Segment) | null,
			"strict"
		>;
	});

	it("narrows the output when the input is a path", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		const result = DPath.getBaseName(path);

		expect(result).toBe("file.txt");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Segment) | null,
			"strict"
		>;
	});

	it("preserves a hidden file segment when no extension can be removed", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/.env");

		const result = DPath.getBaseName(path, { removeExtension: true });

		expect(result).toBe(".env");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Segment) | null,
			"strict"
		>;
	});

	it("requires a path input", () => {
		const path = "/alpha/beta/file.txt";

		// @ts-expect-error path must be validated before extraction.
		expect(DPath.getBaseName(path)).toBe("file.txt");
	});

	it("can be used directly in a pipe", () => {
		const path: string & DPath.Path = DCommon.infer("/alpha/beta/file.txt");

		const result = pipe(
			path,
			DPath.getBaseName,
		);

		expect(result).toBe("file.txt");

		type _CheckResult = ExpectType<
			typeof result,
			(string & DPath.Segment) | null,
			"strict"
		>;
	});
});
