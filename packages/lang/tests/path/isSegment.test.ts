import { DPath, type ExpectType } from "@scripts";

describe("isSegment", () => {
	it.each([
		"foo",
		"foo.txt",
		"foo bar",
		"foo-bar_42",
		"dossier-été",
		".git",
	])("validates path segment %s", (value) => {
		expect(DPath.isSegment(value)).toBe(true);
	});

	it.each([
		"",
		".",
		"..",
		"foo/bar",
		"/foo",
		"foo/",
		"foo\0bar",
		"\0foo",
		"foo\0",
	])("rejects invalid path segment %s", (value) => {
		expect(DPath.isSegment(value)).toBe(false);
	});

	it("narrows literals and broad strings", () => {
		const literal = "foo" as "foo" | "." | "foo/bar";

		if (DPath.isSegment(literal)) {
			type _CheckLiteral = ExpectType<
				typeof literal,
				"foo",
				"strict"
			>;
		} else {
			type _CheckLiteral = ExpectType<
				typeof literal,
				"." | "foo/bar",
				"strict"
			>;
		}

		const value = "foo" as string;

		if (DPath.isSegment(value)) {
			type _CheckValue = ExpectType<
				typeof value,
				string & DPath.Segment,
				"strict"
			>;
		} else {
			type _CheckValue = ExpectType<
				typeof value,
				string,
				"strict"
			>;
		}
	});

	it("preserves an existing Segment constraint", () => {
		const value = "foo" as string & DPath.Segment;

		if (DPath.isSegment(value)) {
			type _CheckValue = ExpectType<
				typeof value,
				string & DPath.Segment,
				"strict"
			>;
		}
	});
});
