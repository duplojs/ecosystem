import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DSPath from "@scripts/path";
import { setEnvironment, TESTImplementation } from "@scripts";
import { currentOS, OS } from "@scripts/implementor";

describe("createAbsolute", () => {
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
		[OS.linux, "/", "/"],
		[OS.linux, "/foo/../bar//", "/bar"],
		[OS.linux, "file:///tmp/foo", "/tmp/foo"],
		[OS.windows, "/", "/DRV-D:"],
		[OS.windows, "C:\\foo", "/DRV-C:/foo"],
		[OS.windows, "/DRV-C:/foo", "/DRV-C:/foo"],
		[OS.windows, "\\\\server\\share", "/UNC:/server/share"],
		[OS.windows, "\\\\.\\pipe\\name", "/DEVICE:/pipe/name"],
		[OS.windows, "\\\\?\\Volume{example}\\foo", "/DEVICE:/Volume{example}/foo"],
		[OS.windows, "file:///C:/../foo", "/DRV-C:/foo"],
	] as const)("creates a path on %s from %j", (os, input, expected) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		const result = DSPath.createAbsolute(input);
		const value = DEither.unwrapByInformationOrThrow(result, "success");

		expect(value).toBe(expected);
		expect(DPath.is(value)).toBe(true);
		expect(DPath.isAbsolute(value)).toBe(true);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string & DPath.Absolute & DPath.Path> | DEither.Left<"create-absolute-path-error", string>,
			"strict"
		>;
		type _CheckValue = DCommon.ExpectType<typeof value, string & DPath.Absolute & DPath.Path, "strict">;
	});

	it.each([
		[OS.linux, "foo\u0000bar"],
		[OS.windows, "C:\\foo\u0000bar"],
		[OS.linux, ""],
		[OS.linux, "foo"],
		[OS.linux, "../foo"],
		[OS.linux, "C:\\foo"],
		[OS.windows, ""],
		[OS.windows, "foo"],
		[OS.windows, "foo/../C:/bar"],
		[OS.windows, "DRV-C:/foo"],
		[OS.windows, "C:foo"],
	] as const)("rejects an incompatible or invalid input on %s: %j", (os, input) => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(os);

		const result = DSPath.createAbsolute(input);
		const value = DEither.unwrapByInformationOrThrow(result, "create-absolute-path-error");

		expect(value).toBe(input);

		type _CheckValue = DCommon.ExpectType<typeof value, string, "strict">;
	});

	it("fails when the current drive is unavailable", () => {
		vi.spyOn(currentOS, "value", "get").mockReturnValue(OS.windows);
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.error("unavailable"));

		const result = DSPath.createAbsolute("/foo");

		expect(DEither.unwrapByInformationOrThrow(result, "create-absolute-path-error")).toBe("/foo");
	});
});
