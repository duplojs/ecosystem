import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DSPath from "@scripts/path";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("createOrThrow", () => {
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
		[OS.linux, "", "."],
		[OS.linux, "foo/../bar/", "bar"],
		[OS.linux, "/foo/../bar", "/bar"],
		[OS.linux, "foo\\bar", "foo\\bar"],
		[OS.linux, "file:///tmp/foo", "/tmp/foo"],
		[OS.windows, "", "."],
		[OS.windows, "foo\\..\\bar", "bar"],
		[OS.windows, "foo/../C:/bar", "DRV-C:/bar"],
		[OS.windows, "C:\\foo", "/DRV-C:/foo"],
		[OS.windows, "/foo", "/DRV-D:/foo"],
		[OS.windows, "\\\\server\\share\\foo", "/UNC:/server/share/foo"],
		[OS.windows, "\\\\?\\GLOBALROOT\\Device\\foo", "/DEVICE:/GLOBALROOT/Device/foo"],
	] as const)("creates a path on %s from %j", (os, input, expected) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		const value = DSPath.createOrThrow(input);

		expect(value).toBe(expected);
		expect(DPath.is(value)).toBe(true);

		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Path, "strict">;
	});

	it.each([
		[OS.linux, "foo\u0000bar"],
		[OS.windows, "C:\\foo\u0000bar"],
		[OS.linux, "file:///foo%GG"],
		[OS.windows, "file:///C:/foo%GG"],
	] as const)("rejects an incompatible or invalid input on %s: %j", (os, input) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		expect(() => DSPath.createOrThrow(input)).toThrow(DSPath.CreatePathError);
		expect(() => DSPath.createOrThrow(input)).toThrow(new DSPath.CreatePathError(input));
	});

	it("fails when the current drive is unavailable", () => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.windows);
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.left("get-current-work-directory-error", "unavailable"));

		expect(() => DSPath.createOrThrow("/foo")).toThrow(DSPath.CreatePathError);
	});

	it("exposes the original input and diagnostic message on CreatePathError", () => {
		const error = new DSPath.CreatePathError("invalid/\0path");

		expect(error).toBeInstanceOf(Error);
		expect(error.value).toBe("invalid/\0path");
		expect(error.message).toBe("Invalid path: invalid/\u0000path");

		type _CheckValue = DCommon.ExpectType<typeof error.value, string, "strict">;
	});
});
