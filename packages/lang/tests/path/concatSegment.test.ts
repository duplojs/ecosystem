import * as DCommon from "@scripts/common";
import * as DPath from "@scripts/path";

describe("concatSegment", () => {
	it.each([
		{
			base: "file",
			newPart: ".ts",
			expected: "file.ts",
		},
		{
			base: ".git",
			newPart: "ignore",
			expected: ".gitignore",
		},
		{
			base: "été",
			newPart: " chaud",
			expected: "été chaud",
		},
	])("concatenates $base and $newPart into $expected", ({ base, newPart, expected }) => {
		const result = DPath.concatSegment(
			DPath.createSegmentOrThrow(base),
			DPath.createSegmentOrThrow(newPart),
		);

		expect(result).toBe(expected);
		expect(DPath.isSegment(result)).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment, "strict">;
	});

	it("concatenates several segments in order", () => {
		const result = DPath.concatSegment(
			DPath.declareSegment("file"),
			DPath.declareSegment(".test"),
			DPath.declareSegment(".ts"),
			DPath.declareSegment(".bak"),
		);

		expect(result).toBe("file.test.ts.bak");
		expect(DPath.isSegment(result)).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment, "strict">;
	});

	it("preserves the segment constraint in a pipe", () => {
		const result = DCommon.pipe(
			DPath.declareSegment("file"),
			DPath.concatSegment(DPath.declareSegment(".test")),
			DPath.concatSegment(DPath.declareSegment(".ts")),
		);

		expect(result).toBe("file.test.ts");
		expect(DPath.isSegment(result)).toBe(true);

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Segment, "strict">;
	});

	it("requires constrained segments for every argument", () => {
		const segment = DPath.declareSegment("file");

		// @ts-expect-error the base must be a constrained segment.
		DPath.concatSegment("file", segment);
		// @ts-expect-error the new part must be a constrained segment.
		DPath.concatSegment(segment, "file");
		// @ts-expect-error every additional part must be a constrained segment.
		DPath.concatSegment(segment, segment, "file");
		// @ts-expect-error the curried new part must be a constrained segment.
		DPath.concatSegment("file");
		// @ts-expect-error the curried base must be a constrained segment.
		DPath.concatSegment(segment)("file");
	});

	it("accepts only one base argument in its curried form", () => {
		const segment = DPath.declareSegment("file");
		const concatenate = DPath.concatSegment(segment);

		type _CheckParameters = DCommon.ExpectType<
			Parameters<typeof concatenate>,
			[base: string & DPath.Segment],
			"strict"
		>;

		// @ts-expect-error the curried function has no rest parameter.
		concatenate(segment, segment);
	});
});
