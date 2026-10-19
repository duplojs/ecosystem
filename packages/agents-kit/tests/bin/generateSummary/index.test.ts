import { generateSummaryCommand } from "../../../bin/generateSummary";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";
import * as DSFile from "@duplojs/server/file";

describe("generateSummaryCommand", () => {
	const writeTextFile = vi.fn(() => Promise.resolve(DEither.right("file-system-write-text-file")));
	const readTextFile = vi.fn(() => Promise.resolve(DEither.right("file-system-read-text-file", "# Docs")));

	beforeEach(() => {
		setEnvironment("TEST");
		writeTextFile.mockClear();
		readTextFile.mockClear();
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		TESTImplementation.set("stat", () => Promise.resolve(DEither.right("file-system-stat", {
			isFile: false,
			isDirectory: true,
			isSymlink: false,
			sizeBytes: 0,
			modifiedAt: null,
			accessedAt: null,
			createdAt: null,
			changedAt: null,
			deviceId: 0,
			inode: null,
			permissionsMode: null,
			hardLinkCount: null,
			ownerUserId: null,
			ownerGroupId: null,
			specialDeviceId: null,
			ioBlockSize: null,
			allocatedBlockCount: null,
			isBlockDevice: null,
			isCharacterDevice: null,
			isFifo: null,
			isSocket: null,
		})));
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map([DPath.declareAbsolutePath("/docs/index.md")], DSFile.createFileInterface),
		)));
		TESTImplementation.set("readTextFile", readTextFile);
		TESTImplementation.set("writeTextFile", writeTextFile);
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it.each([
		{
			args: [],
			expected: "# Docs\n",
		},
		{
			args: ["--ignore", "*"],
			expected: "",
		},
	])("generates a documentation summary as a reusable command with $args", async({ args, expected }) => {
		const error = DSCommand.createError("generate-summary");

		const result = await generateSummaryCommand.execute(["--input", "/docs", "--output", "/docs/router.llms.md", ...args], error);

		type _CheckCommand = DCommon.ExpectType<typeof generateSummaryCommand, DSCommand.Command<"generate-summary">, "strict">;
		type _CheckResult = DCommon.ExpectType<typeof result, undefined | DSCommand.SymbolCommandError, "strict">;

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(writeTextFile).toHaveBeenCalledExactlyOnceWith("/docs/router.llms.md", expected);
	});

	it.each([
		["--input", "/docs"],
		["--output", "/docs/router.llms.md"],
	])("rejects missing required options with %j", async(...args) => {
		const error = DSCommand.createError("generate-summary");

		const result = await generateSummaryCommand.execute(args, error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toHaveLength(1);
		expect(writeTextFile).not.toHaveBeenCalled();
	});

	it.each(["router.llms.md", "nested/router.llms.md"])("accepts the relative output path %s", async(output) => {
		const error = DSCommand.createError("generate-summary");

		const result = await generateSummaryCommand.execute(["--input", "/docs", "--output", output], error);

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(writeTextFile).toHaveBeenCalledExactlyOnceWith(output, "# Docs\n");
	});

	it.each([
		"/docs/router.md",
		"/docs/router.llms",
		"/docs/router.llms.md.bak",
		"/docs/routerxllms.md",
		"/docs/router.llms.md\n",
		"/docs/router.LLMS.md",
	])("rejects the output path %j without the exact .llms.md suffix", async(output) => {
		const error = DSCommand.createError("generate-summary");

		const result = await generateSummaryCommand.execute(["--input", "/docs", "--output", output], error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toHaveLength(1);
		expect(readTextFile).not.toHaveBeenCalled();
		expect(writeTextFile).not.toHaveBeenCalled();
	});

	it("dispatches generate-summary from the local bin entry point", async() => {
		const getProcessArguments = vi.fn(() => ["generate-summary", "--input", "/docs", "--output", "/docs/router.llms.md"]);
		TESTImplementation.set("getProcessArguments", getProcessArguments);

		await import("../../../bin");

		expect(getProcessArguments).toHaveBeenCalledExactlyOnceWith();
		expect(readTextFile).toHaveBeenCalledExactlyOnceWith("/docs/index.md");
		expect(writeTextFile).toHaveBeenCalledExactlyOnceWith("/docs/router.llms.md", "# Docs\n");
	});
});
