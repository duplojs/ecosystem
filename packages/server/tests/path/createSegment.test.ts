import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DSPath from "@scripts/path";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("createSegment", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(DPath.declareAbsolutePath("/DRV-D:/work")));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
		vi.restoreAllMocks();
	});

	it.each([
		[OS.linux, "foo", "foo"],
		[OS.linux, "./foo/", "foo"],
		[OS.linux, "foo/../bar", "bar"],
		[OS.linux, "foo\\bar", "foo\\bar"],
		[OS.windows, "foo", "foo"],
		[OS.windows, "foo\\..\\bar", "bar"],
		[OS.windows, "dir/../C:", "DRV-C:"],
		[OS.windows, "DRV-C:", "DRV-C:"],
		[OS.windows, "C:foo", "C:foo"],
	] as const)("creates a path on %s from %j", (os, input, expected) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		const result = DSPath.createSegment(input);
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);
		expect(DPath.is(value)).toBe(true);
		expect(DPath.isSegment(value)).toBe(true);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string & DPath.Segment & DPath.Path> | DEither.Left<"create-segment-path-error", string>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Segment & DPath.Path, "strict">;
	});

	it.each([
		[OS.linux, "foo\u0000bar"],
		[OS.windows, "C:\\foo\u0000bar"],
		[OS.linux, ""],
		[OS.linux, "."],
		[OS.linux, ".."],
		[OS.linux, "foo/bar"],
		[OS.linux, "/foo"],
		[OS.windows, ""],
		[OS.windows, "."],
		[OS.windows, ".."],
		[OS.windows, "foo\\bar"],
		[OS.windows, "C:"],
		[OS.windows, "C:\\foo"],
		[OS.windows, "file:///C:/foo"],
	] as const)("rejects an incompatible or invalid input on %s: %j", (os, input) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		const result = DSPath.createSegment(input);
		const value = DEither.unwrapByInformationOrThrow(result, "create-segment-path-error");

		expect(value).toBe(input);

		type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;
	});
});
