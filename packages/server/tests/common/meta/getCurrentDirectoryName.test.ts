import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
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
			DEither.Error<string> | DEither.Success<string & DPath.Absolute>,
			"strict"
		>;

		const directoryName = DEither.unwrapByInformationOrThrow(result, "success");

		type _CheckDirectoryName = DCommon.ExpectType<
			typeof directoryName,
			string & DPath.Absolute,
			"strict"
		>;

		expect(directoryName).toBe(import.meta.dirname);
	});

	it("normalizes the directory before applying the absolute path constraint", () => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname: "/tmp//project/../work/",
		};

		const result = DSCommon.getCurrentDirectoryName(importMeta);
		const directoryName = DEither.unwrapByInformationOrThrow(result, "success");

		expect(directoryName).toBe("/tmp/work");
	});

	it.each(["relative/path", ""])("rejects a directory that is not absolute: %j", (dirname) => {
		setEnvironment("NODE");
		const importMeta = {
			...import.meta,
			dirname,
		};

		const result = DSCommon.getCurrentDirectoryName(importMeta);
		const error = DEither.unwrapByInformationOrThrow(result, "error");

		type _CheckError = DCommon.ExpectType<typeof error, string, "strict">;

		expect(error).toBe(dirname);
	});
});
