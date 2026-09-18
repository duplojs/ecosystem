import { DPath, type ExpectType } from "@scripts";

describe("declareSegment", () => {
	it("returns the declared segment with its constraint and literal type", () => {
		const segment = DPath.declareSegment("folder.txt");

		expect(segment).toBe("folder.txt");

		type _CheckSegment = ExpectType<
			typeof segment,
			"folder.txt" & DPath.Segment,
			"strict"
		>;
	});

	it("only accepts literal path segments", () => {
		// @ts-expect-error an empty string is not a segment.
		DPath.declareSegment("");
		// @ts-expect-error a dot is not a segment.
		DPath.declareSegment(".");
		// @ts-expect-error a parent segment is not a segment.
		DPath.declareSegment("..");
		// @ts-expect-error a segment cannot contain a separator.
		DPath.declareSegment("foo/bar");
		// @ts-expect-error a segment cannot contain a null byte.
		DPath.declareSegment("foo\0bar");

		const value = "folder" as string;

		// @ts-expect-error a broad string must be validated before declaration.
		DPath.declareSegment(value);
	});
});
