import { DPath, type ExpectType } from "@scripts";

describe("declarePath", () => {
	it("returns the declared path with its constraint and literal type", () => {
		const path = DPath.declarePath("../folder/file.txt");

		expect(path).toBe("../folder/file.txt");

		type _CheckPath = ExpectType<
			typeof path,
			"../folder/file.txt" & DPath.Path,
			"strict"
		>;
	});

	it("accepts the root and current paths", () => {
		expect(DPath.declarePath("/")).toBe("/");
		expect(DPath.declarePath(".")).toBe(".");
	});

	it("only accepts literal paths", () => {
		// @ts-expect-error an empty string is not a path.
		DPath.declarePath("");
		// @ts-expect-error a normalized path cannot contain a dot segment.
		DPath.declarePath("foo/./bar");
		// @ts-expect-error a normalized path cannot contain empty segments.
		DPath.declarePath("foo//bar");
		// @ts-expect-error a path cannot contain a null byte.
		DPath.declarePath("foo\0bar");

		const value = "folder/file.txt" as string;

		// @ts-expect-error a broad string must be validated before declaration.
		DPath.declarePath(value);
	});
});
