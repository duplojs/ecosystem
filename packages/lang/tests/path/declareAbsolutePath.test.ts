import { DPath, type ExpectType } from "@scripts";

describe("declareAbsolutePath", () => {
	it("returns the declared absolute path with its constraint and literal type", () => {
		const path = DPath.declareAbsolutePath("/folder/file.txt");

		expect(path).toBe("/folder/file.txt");

		type _CheckPath = ExpectType<
			typeof path,
			"/folder/file.txt" & DPath.Absolute,
			"strict"
		>;
	});

	it("accepts the root path", () => {
		expect(DPath.declareAbsolutePath("/")).toBe("/");
	});

	it("only accepts literal absolute paths", () => {
		// @ts-expect-error a relative path is not absolute.
		DPath.declareAbsolutePath("folder/file.txt");
		// @ts-expect-error the current path is not absolute.
		DPath.declareAbsolutePath(".");
		// @ts-expect-error a normalized absolute path cannot contain a dot segment.
		DPath.declareAbsolutePath("/foo/./bar");
		// @ts-expect-error an absolute path cannot contain a null byte.
		DPath.declareAbsolutePath("/foo\0bar");

		const value = "/folder/file.txt" as string;

		// @ts-expect-error a broad string must be validated before declaration.
		DPath.declareAbsolutePath(value);
	});
});
