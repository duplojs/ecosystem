import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile } from "@scripts";

describe("mimeType", () => {
	it.each([
		{
			input: "image/png",
			expected: /^image\/png$/,
		},
		{
			input: /^image\//,
			expected: /^image\//,
		},
	] as const)("creates a MIME type constraint from $input", ({ input, expected }) => {
		const constraint = DSDataStructure.mimeType(input);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.MimeTypeConstraint,
			"strict"
		>;

		expect(DSDataStructure.mimeTypeConstraintKind.has(constraint)).toBe(true);
		expect(constraint.definition.regex).toStrictEqual(expected);
		expect(constraint.isAsynchronous()).toBe(false);
	});

	it.each([
		{
			path: "/tmp/avatar.png",
			expected: true,
		},
		{
			path: "/tmp/notes.txt",
			expected: false,
		},
		{
			path: "/tmp/README",
			expected: false,
		},
	] as const)("applies the constraint to $path", ({ path, expected }) => {
		const structure = DSDataStructure.file([DSDataStructure.mimeType(/^image\//)]);
		const file = DSFile.createFileInterface(DPath.declarePath(path));

		const result = structure.check(file);

		expect(DEither.isRight(result)).toBe(expected);
	});
});
