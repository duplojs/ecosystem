import { generateLlmsCommand } from "@scripts/bin/generateLlms";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";
import type * as DSFile from "@duplojs/server/file";

describe("generateLlmsCommand", () => {
	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project"));
		TESTImplementation.set("stat", vi.fn().mockResolvedValue(DEither.right("file-system-stat", { isDirectory: true })));
		TESTImplementation.set("walkDirectory", () => Promise.resolve(DEither.right("file-system-walk-directory", DGenerator.map([], DCommon.forward))));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("resolves paths and waits for the output to be written", async() => {
		const walkDirectory = vi.fn(() => Promise.resolve(DEither.right("file-system-walk-directory", DGenerator.map([], DCommon.forward))));
		const pending = Promise.withResolvers<DSFile.WriteTextFileResult>();
		const writeTextFile = vi.fn(() => pending.promise);
		TESTImplementation.set("walkDirectory", walkDirectory);
		TESTImplementation.set("writeTextFile", writeTextFile);
		const error = DSCommand.createError("generate-llms");
		const finished = vi.fn();

		const execution = generateLlmsCommand.execute(["--input", "docs/concepts", "--output", "docs/LLMS.md"], error).then(finished);

		await vi.waitFor(() => expect(writeTextFile).toHaveBeenCalledTimes(1));
		expect(walkDirectory).toHaveBeenCalledExactlyOnceWith("/project/docs/concepts");
		expect(writeTextFile).toHaveBeenCalledExactlyOnceWith("docs/LLMS.md", "");
		expect(finished).not.toHaveBeenCalled();
		pending.resolve(DEither.right("file-system-write-text-file"));
		await execution;

		type _CheckCommand = DCommon.ExpectType<typeof generateLlmsCommand, DSCommand.Command<"generate-llms">, "strict">;
		expect(error.issues).toEqual([]);
		expect(finished).toHaveBeenCalledExactlyOnceWith(undefined);
	});

	it.each([
		[],
		["--input", "docs/concepts"],
		["--output", "LLMS.md"],
		["--input", "docs/concepts", "--output", ""],
	])("rejects missing or invalid options %j", async(...args) => {
		const writeTextFile = vi.fn();
		TESTImplementation.set("writeTextFile", writeTextFile);
		const error = DSCommand.createError("generate-llms");

		const result = await generateLlmsCommand.execute(args, error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues.length).toBeGreaterThan(0);
		expect(writeTextFile).not.toHaveBeenCalled();
	});

	it("rejects an input that is not a directory", async() => {
		TESTImplementation.set("stat", vi.fn().mockResolvedValue(DEither.right("file-system-stat", { isDirectory: false })));
		const writeTextFile = vi.fn();
		TESTImplementation.set("writeTextFile", writeTextFile);
		const error = DSCommand.createError("generate-llms");

		const result = await generateLlmsCommand.execute(["--input", "missing", "--output", "LLMS.md"], error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toHaveLength(1);
		expect(writeTextFile).not.toHaveBeenCalled();
	});
});
