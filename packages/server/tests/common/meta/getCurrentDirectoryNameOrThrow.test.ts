import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { DSCommon, setEnvironment } from "@scripts";

describe("getCurrentDirectoryNameOrThrow", () => {
	afterEach(() => {
		setEnvironment("NODE");
	});

	it.each(["NODE", "BUN", "DENO"] as const)("returns the module directory with an absolute path constraint in %s", (environment) => {
		setEnvironment(environment);

		const result = DSCommon.getCurrentDirectoryNameOrThrow(import.meta);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string & DPath.Absolute,
			"strict"
		>;

		expect(result).toBe(import.meta.dirname);
	});

	it("returns the normalized absolute directory", () => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname: "/tmp//project/../work/",
		};

		const result = DSCommon.getCurrentDirectoryNameOrThrow(importMeta);

		expect(result).toBe("/tmp/work");
	});

	it.each(["relative/path", ""])("throws with the invalid directory: %j", (dirname) => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname,
		};

		expect(() => DSCommon.getCurrentDirectoryNameOrThrow(importMeta))
			.toThrowError(DSCommon.GetCurrentDirectoryNameError);
		expect(() => DSCommon.getCurrentDirectoryNameOrThrow(importMeta))
			.toThrowError(expect.objectContaining({
				error: dirname,
				message: "Failed to retrieve the current module directory path.",
			}));
	});
});
