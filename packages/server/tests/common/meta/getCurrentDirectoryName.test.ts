import type * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import { DSCommon, setEnvironment } from "@scripts";

describe("getCurrentDirectoryName", () => {
	afterEach(() => {
		setEnvironment("NODE");
	});

	it.each(["NODE", "BUN", "DENO"] as const)("returns the module directory with an absolute path constraint in %s", (environment) => {
		setEnvironment(environment);

		const result = DSCommon.getCurrentDirectoryName(import.meta);

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			string & DPath.Absolute,
			"strict"
		>;

		expect(result).toBe(import.meta.dirname);
	});

	it("normalizes the directory before applying the absolute path constraint", () => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname: "/tmp//project/../work/",
		};

		const result = DSCommon.getCurrentDirectoryName(importMeta);

		expect(result).toBe("/tmp/work");
	});

	it.each(["relative/path", ""])("rejects a directory that is not absolute: %j", (dirname) => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname,
		};

		expect(() => DSCommon.getCurrentDirectoryName(importMeta))
			.toThrowError(DPath.CreateAbsolutePathError);
		expect(() => DSCommon.getCurrentDirectoryName(importMeta))
			.toThrowError(expect.objectContaining({ value: dirname }));
	});
});
