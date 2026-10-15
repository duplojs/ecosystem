import { setupCommand, SetupTypeEnum } from "@scripts/bin/setup";
import { getPackagePath } from "@scripts/bin/packagePath";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import type * as DSFile from "@duplojs/server/file";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSCommand from "@duplojs/server/command";

vi.mock("node:module", () => ({ findPackageJSON: vi.fn(() => "/project with spaces/node_modules/@duplojs/agents-kit/package.json") }));

class NotFoundError extends DCommon.DuploJSError.parentClass("file-system-read-text-file-not-found", Error) {}
class ReadError extends DCommon.DuploJSError.parentClass("file-system-read-text-file-permission-denied", Error) {}
class WriteError extends DCommon.DuploJSError.parentClass("file-system-write-text-file-permission-denied", Error) {}

const packagePath = getPackagePath();
const start = "<!-- duplojs-agents-kit:coding-conventions:start -->";
const stop = "<!-- duplojs-agents-kit:coding-conventions:stop -->";

describe("SetupTypeEnum", () => {
	it("lists the supported setup types", () => {
		type _CheckType = DCommon.ExpectType<SetupTypeEnum, "default" | "claude", "strict">;

		expect(SetupTypeEnum.toTuple()).toEqual(["default", "claude"]);
	});
});

describe("setupCommand", () => {
	const exitProcess = vi.fn();

	beforeEach(() => {
		setEnvironment("TEST");
		exitProcess.mockClear();
		TESTImplementation.set("exitProcess", exitProcess);
		vi.spyOn(console, "error").mockImplementation(() => {});
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute("/project with spaces"));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
		vi.restoreAllMocks();
	});

	it.each([
		{
			args: [],
			fileName: "AGENTS.md",
		},
		{
			args: ["--type", "default"],
			fileName: "AGENTS.md",
		},
		{
			args: ["--type", "claude"],
			fileName: "CLAUDE.md",
		},
	])("creates $fileName for arguments $args", async({ args, fileName }) => {
		const read = vi.fn()
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", "Read {{packagePath}}/docs."))
			.mockResolvedValueOnce(DEither.left("file-system-read-text-file-error", new NotFoundError(new Error("Missing file"))));
		const write = vi.fn<typeof DSFile.writeTextFile>().mockResolvedValue(DEither.right("file-system-write-text-file"));
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);
		const error = DSCommand.createError("setup");

		const result = await setupCommand.execute(args, error);

		type _CheckCommand = DCommon.ExpectType<typeof setupCommand, DSCommand.Command<"setup">, "strict">;
		type _CheckResult = DCommon.ExpectType<typeof result, undefined | DSCommand.SymbolCommandError, "strict">;

		expect(result).toBeUndefined();
		expect(error.issues).toEqual([]);
		expect(exitProcess).not.toHaveBeenCalled();
		expect(read).toHaveBeenNthCalledWith(1, `${packagePath}/instructions/coding-conventions.md`);
		expect(read).toHaveBeenNthCalledWith(2, `/project with spaces/${fileName}`);
		expect(write).toHaveBeenCalledExactlyOnceWith(`/project with spaces/${fileName}`, expect.any(String));
		const [, content] = write.mock.calls[0]!;
		expect(content).toContain("node_modules/@duplojs/agents-kit");
		expect(content).not.toContain(packagePath);
		expect(content).not.toContain("{{packagePath}}");

		expect(content).toMatchSnapshot();
	});

	it.each([
		{
			directory: "/project with spaces/apps/api",
			relativePath: "../../node_modules/@duplojs/agents-kit",
		},
		{
			directory: "/project with spaces/node_modules/@duplojs/agents-kit",
			relativePath: ".",
		},
		{
			directory: "/other project with spaces",
			relativePath: "../project with spaces/node_modules/@duplojs/agents-kit",
		},
	])("inserts a package path relative to AGENTS.md in $directory", async({ directory, relativePath }) => {
		TESTImplementation.set("getCurrentWorkDirectory", () => DPath.createAbsolute(directory));
		const read = vi.fn()
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", "Read {{packagePath}}/docs."))
			.mockResolvedValueOnce(DEither.left("file-system-read-text-file-error", new NotFoundError(new Error("Missing file"))));
		const write = vi.fn<typeof DSFile.writeTextFile>().mockResolvedValue(DEither.right("file-system-write-text-file"));
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		await setupCommand.execute([], DSCommand.createError("setup"));

		expect(write).toHaveBeenCalledExactlyOnceWith(`${directory}/AGENTS.md`, expect.any(String));
		const [, content] = write.mock.calls[0]!;
		expect(content).toContain(`Read ${relativePath}/docs.`);
		expect(content).not.toContain(`Read ${packagePath}/docs.`);
		expect(content).toMatchSnapshot();
	});

	it.each([
		{
			type: "default",
			fileName: "AGENTS.md",
		},
		{
			type: "claude",
			fileName: "CLAUDE.md",
		},
	])("updates the existing $fileName block and preserves project instructions", async({ type, fileName }) => {
		const read = vi.fn()
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", "Updated"))
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", `Before\n${start}\nOld\n${stop}\nAfter`));
		const write = vi.fn<typeof DSFile.writeTextFile>().mockResolvedValue(DEither.right("file-system-write-text-file"));
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		await setupCommand.execute(["--type", type], DSCommand.createError("setup"));

		expect(write).toHaveBeenCalledExactlyOnceWith(`/project with spaces/${fileName}`, expect.any(String));
		const [, content] = write.mock.calls[0]!;

		expect(content).toMatchSnapshot();
	});

	it("does not write when AGENTS.md cannot be read", async() => {
		const failure = new ReadError(new Error("Read denied"));
		const read = vi.fn()
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", "Conventions"))
			.mockResolvedValueOnce(DEither.left("file-system-read-text-file-error", failure));
		const write = vi.fn();
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(console.error).toHaveBeenCalledExactlyOnceWith(failure);
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);

		expect(write).not.toHaveBeenCalled();
	});

	it("does not touch AGENTS.md when the template cannot be read", async() => {
		const read = vi.fn(() => Promise.resolve(DEither.left("file-system-read-text-file-error", new ReadError(new Error("Read denied")))));
		const write = vi.fn();
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(console.error).toHaveBeenCalledOnce();
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);

		expect(read).toHaveBeenCalledTimes(1);
		expect(write).not.toHaveBeenCalled();
	});

	it("reports write failures", async() => {
		const read = vi.fn(() => Promise.resolve(DEither.right("file-system-read-text-file", "")));
		const write = vi.fn(() => Promise.resolve(DEither.left("file-system-write-text-file-error", new WriteError(new Error("Write denied")))));
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(console.error).toHaveBeenCalledOnce();
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);

		expect(write).toHaveBeenCalledTimes(1);
	});

	it("does not write a file with incomplete markers", async() => {
		const read = vi.fn()
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", "Conventions"))
			.mockResolvedValueOnce(DEither.right("file-system-read-text-file", start));
		const write = vi.fn();
		TESTImplementation.set("readTextFile", read);
		TESTImplementation.set("writeTextFile", write);

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(console.error).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ message: expect.stringContaining("invalid markers") }));
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);

		expect(write).not.toHaveBeenCalled();
	});

	it("reports the working directory failure without accessing files", async() => {
		const failure = DEither.error("Working directory unavailable");
		const read = vi.fn();
		TESTImplementation.set("getCurrentWorkDirectory", () => failure);
		TESTImplementation.set("readTextFile", read);

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(console.error).toHaveBeenCalledExactlyOnceWith("Working directory unavailable");
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);
		expect(read).not.toHaveBeenCalled();
	});

	it("displays operational errors at the command boundary", async() => {
		const failure = new ReadError(new Error("Read denied"));
		const log = vi.spyOn(console, "error").mockImplementation(() => {});
		TESTImplementation.set("readTextFile", () => Promise.resolve(DEither.left("file-system-read-text-file-error", failure)));

		const result = await setupCommand.execute([], DSCommand.createError("setup"));

		expect(result).toBeUndefined();
		expect(log).toHaveBeenCalledExactlyOnceWith(failure);
		expect(exitProcess).toHaveBeenCalledExactlyOnceWith(1);
	});

	it.each(["codex", "unknown"])("rejects the unsupported %s type before reading files", async(type) => {
		const read = vi.fn();
		TESTImplementation.set("readTextFile", read);
		const error = DSCommand.createError("setup");

		const result = await setupCommand.execute(["--type", type], error);

		expect(result).toBe(DSCommand.SymbolCommandError);
		expect(error.issues).toHaveLength(1);
		expect(read).not.toHaveBeenCalled();
	});
});
