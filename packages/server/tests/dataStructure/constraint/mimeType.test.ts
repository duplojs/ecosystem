import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DPath from "@duplojs/lang/path";
import { DSDataStructure, DSFile } from "@scripts";

describe("MimeTypeConstraint", () => {
	it.each([
		{
			mimeType: "image/png",
			path: "/tmp/avatar.png",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			mimeType: "image/png",
			path: "/tmp/notes.txt",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			mimeType: "image/png",
			path: "/tmp/README",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			mimeType: /^image\//,
			path: "/tmp/avatar.png",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			mimeType: /^image\//,
			path: "/tmp/avatar.jpg",
			expected: DDataStructure.SuccessSymbol,
		},
		{
			mimeType: /^image\//,
			path: "/tmp/notes.txt",
			expected: DDataStructure.ErrorSymbol,
		},
		{
			mimeType: /^image\//,
			path: "/tmp/README",
			expected: DDataStructure.ErrorSymbol,
		},
	] as const)("checks $path against $mimeType", ({ mimeType, path, expected }) => {
		const constraint = DSDataStructure.MimeTypeConstraint(mimeType);
		const file = DSFile.createFileInterface(DPath.declarePath(path));

		const result = constraint.executeCheck(file);

		type _CheckConstraint = DCommon.ExpectType<
			typeof constraint,
			DSDataStructure.MimeTypeConstraint,
			"strict"
		>;

		expect(result).toBe(expected);
		expect(constraint.isAsynchronous()).toBe(false);
	});
});
