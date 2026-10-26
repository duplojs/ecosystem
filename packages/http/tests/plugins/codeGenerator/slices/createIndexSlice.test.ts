import { createIndexSlice } from "@plugin-codeGenerator";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";
import { TypescriptNativeAPI } from "@duplojs/tools";

describe("createIndexSlice", () => {
	const workDirectory = DPath.declareAbsolutePath("/project");
	const mockFiles = (paths: readonly (string & DPath.Absolute)[]) => {
		TESTImplementation.set("walkDirectory", (_path, params) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(
				DGenerator.filter(paths, (path) => params?.matcher?.(path) ?? true),
				(path) => DSFile.createFileInterface(path),
			),
		)));
	};

	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
		vi.restoreAllMocks();
	});

	it("recursively selects matching TypeScript files and exports their relative paths in traversal order", async() => {
		const entries = [
			DSFile.createFileInterface(DPath.declareAbsolutePath("/project/models/user.ts")),
			DSFile.createFolderInterface(DPath.declareAbsolutePath("/project/models/folder.ts")),
			DSFile.createUnknownEntryInterface(DPath.declareAbsolutePath("/project/models/unknown.ts")),
			DSFile.createFileInterface(DPath.declareAbsolutePath("/project/models/nested/role.ts")),
			DSFile.createFileInterface(DPath.declareAbsolutePath("/project/models/user.js")),
			DSFile.createFileInterface(DPath.declareAbsolutePath("/project/models/private.ts")),
			DSFile.createFileInterface(DPath.declareAbsolutePath("/project/private/secret.ts")),
		];
		const walk = vi.fn<typeof DSFile.walkDirectory>((_path, params) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.filter(entries, (entry) => params?.matcher?.(entry.path) ?? true),
		)));
		TESTImplementation.set("walkDirectory", walk);
		const isInSlice = vi.fn(DPath.createMatcher(["./models/**", "!./models/private.ts"]));
		const close = vi.spyOn(TypescriptNativeAPI.API.prototype, "close");

		const result = await createIndexSlice({
			workDirectory,
			isInSlice,
		});
		const content = DEither.unwrapByInformationOrThrow(result, "success");

		type _CheckResult = DCommon.ExpectType<
			typeof result,
			DEither.Success<string> | DEither.Left<"file-system-walk-directory-error", DSFile.WalkDirectoryErrors>,
			"strict"
		>;
		expect(content).toBe("export * from \"./models/user.ts\";\nexport * from \"./models/nested/role.ts\";");
		expect(walk).toHaveBeenCalledExactlyOnceWith(workDirectory, {
			recursive: true,
			matcher: expect.any(Function),
		});
		expect(isInSlice.mock.calls).toStrictEqual([
			["models/user.ts"],
			["models/folder.ts"],
			["models/unknown.ts"],
			["models/nested/role.ts"],
			["models/private.ts"],
			["private/secret.ts"],
		]);
		expect(close).toHaveBeenCalledOnce();
	});

	it.each([
		{
			label: "an empty directory",
			paths: [],
			pattern: "**",
		},
		{
			label: "no matching files",
			paths: [DPath.declareAbsolutePath("/project/user.ts")],
			pattern: "contracts/**",
		},
	] as const)("returns an empty index for $label", async({ paths, pattern }) => {
		mockFiles(paths);
		const result = await createIndexSlice({
			workDirectory,
			isInSlice: DPath.createMatcher(pattern),
		});
		const content = DEither.unwrapByInformationOrThrow(result, "success");

		expect(content).toBe("");
	});

	it("escapes special characters in module specifiers", async() => {
		mockFiles([DPath.declareAbsolutePath("/project/user\"model.ts")]);
		const result = await createIndexSlice({
			workDirectory,
			isInSlice: () => true,
		});
		const content = DEither.unwrapByInformationOrThrow(result, "success");

		expect(content).toBe("export * from \"./user\\\"model.ts\";");
	});

	it("preserves directory errors without selecting files", async() => {
		const error = new DSFile.WalkDirectoryErrorPermissionDenied(new Error("Access denied"));
		const failure = DEither.left("file-system-walk-directory-error", error);
		TESTImplementation.set("walkDirectory", () => Promise.resolve(failure));
		const close = vi.spyOn(TypescriptNativeAPI.API.prototype, "close");
		const isInSlice = vi.fn(() => true);
		const result = await createIndexSlice({
			workDirectory,
			isInSlice,
		});
		const value = DEither.unwrapByInformationOrThrow(result, "file-system-walk-directory-error");

		expect(value).toBe(error);
		expect(result).toBe(failure);
		expect(isInSlice).not.toHaveBeenCalled();
		expect(close).not.toHaveBeenCalled();
	});

	it("propagates unexpected traversal failures", async() => {
		const error = new Error("Cannot traverse directory");
		TESTImplementation.set("walkDirectory", () => Promise.reject(error));

		await expect(createIndexSlice({
			workDirectory,
			isInSlice: () => true,
		})).rejects.toBe(error);
	});
});
