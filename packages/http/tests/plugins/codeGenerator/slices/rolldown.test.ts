import { generateSlicesRolldown } from "@plugin-codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DPath from "@duplojs/lang/path";
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";
import type { Plugin } from "rolldown";
import { runLoad, runOptions, runResolveId } from "../_utils/rolldown";

describe("generateSlicesRolldown", () => {
	const root = DPath.declareAbsolutePath("/project");
	const walk = vi.fn<typeof DSFile.walkDirectory>();

	beforeEach(() => {
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(root));
		walk.mockReset();
		walk.mockImplementation((_path, params) => Promise.resolve(DEither.right(
			"file-system-walk-directory",
			DGenerator.map(
				DGenerator.filter([
					DPath.declareAbsolutePath("/project/src/models/user.ts"),
					DPath.declareAbsolutePath("/project/src/models/private.ts"),
					DPath.declareAbsolutePath("/project/src/contracts/user.ts"),
					DPath.declareAbsolutePath("/project/src/models/user.js"),
				], (path) => params?.matcher?.(path) ?? true),
				(path) => DSFile.createFileInterface(path),
			),
		)));
		TESTImplementation.set("walkDirectory", walk);
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("exposes a typed plugin with an initially empty virtual filesystem", () => {
		const plugin = generateSlicesRolldown({ slices: [] });

		type _Check = DCommon.ExpectType<typeof plugin, Plugin, "strict">;
		expect(plugin.name).toBe("@duplojs/http/codeGenerator:slices");
		expect(runResolveId(plugin, "/project/index.ts")).toBeNull();
		expect(runResolveId(plugin, "/project/index.ts", "/project/consumer.ts")).toBeUndefined();
		expect(runLoad(plugin, "/project/index.ts")).toBeNull();
		expect(walk).not.toHaveBeenCalled();
	});

	it("generates each selected slice and its main index while preserving other input options", async() => {
		const plugin = generateSlicesRolldown({
			workDirectory: DPath.declarePath("src"),
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: ["models/**", "!models/private.ts"],
				},
				{
					name: DCommon.cast("contracts"),
					pattern: "./contracts/**",
				},
			],
		});
		const options = {
			input: "old.ts",
			external: ["external"],
			treeshake: false,
		};
		const result = await runOptions(plugin, options);

		expect(result).toStrictEqual({
			input: {
				models: "/project/src/models.ts",
				contracts: "/project/src/contracts.ts",
				index: "/project/src/index.ts",
			},
			external: ["external"],
			treeshake: false,
		});
		expect(options.input).toBe("old.ts");
		expect(walk).toHaveBeenCalledTimes(2);
		expect(walk).toHaveBeenNthCalledWith(1, "/project/src", {
			recursive: true,
			matcher: expect.any(Function),
		});
		expect(walk).toHaveBeenNthCalledWith(2, "/project/src", {
			recursive: true,
			matcher: expect.any(Function),
		});
		expect(runLoad(plugin, "/project/src/models.ts")).toBe("export * from \"./models/user.ts\";");
		expect(runLoad(plugin, "/project/src/contracts.ts")).toBe("export * from \"./contracts/user.ts\";");
		expect(runLoad(plugin, "/project/src/index.ts")).toBe("export * as Models from \"./models.ts\";\nexport * as Contracts from \"./contracts.ts\";");
		expect(runLoad(plugin, "/project/src/models/user.ts")).toBeNull();
		expect(runResolveId(plugin, "/project/src/contracts.ts")).toBe("/project/src/contracts.ts");
		expect(runResolveId(plugin, "./models.ts", "/project/src/index.ts")).toBe("/project/src/models.ts");
		expect(runResolveId(plugin, "/project/src/nested/../index.ts", "/project/src/consumer.ts")).toBe("/project/src/index.ts");
		expect(runResolveId(plugin, "./missing.ts", "/project/src/index.ts")).toBeUndefined();
		expect(runResolveId(plugin, "bad\0path", "/project/src/index.ts")).toBeNull();
	});

	it("accepts an absolute workDirectory and anchors patterns and exclusions to it", async() => {
		const plugin = generateSlicesRolldown({
			workDirectory: DPath.declareAbsolutePath("/project/src"),
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: ["./models/**", "!./models/private.ts"],
				},
			],
		});
		const result = await runOptions(plugin);

		expect(result).toStrictEqual({
			input: {
				models: "/project/src/models.ts",
				index: "/project/src/index.ts",
			},
		});
		expect(walk).toHaveBeenCalledExactlyOnceWith("/project/src", {
			recursive: true,
			matcher: expect.any(Function),
		});
		expect(runLoad(plugin, "/project/src/models.ts")).toBe("export * from \"./models/user.ts\";");
	});

	it.each([
		{
			label: "a sibling slice imported by the main index",
			importer: "/project/index.ts",
			id: "./models.ts",
			expected: "/project/models.ts",
		},
		{
			label: "a nested source import that must be left to Rolldown",
			importer: "/project/nested/consumer.ts",
			id: "./models.ts",
			expected: undefined,
		},
		{
			label: "a parent slice imported by a nested source file",
			importer: "/project/nested/consumer.ts",
			id: "../models.ts",
			expected: "/project/models.ts",
		},
	])("resolves relative paths from the importer for $label", async({ importer, id, expected }) => {
		const plugin = generateSlicesRolldown({
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: "src/models/user.ts",
				},
			],
		});
		await runOptions(plugin);

		const result = runResolveId(plugin, id, importer);

		expect(result).toBe(expected);
	});

	it.each(["bad\0path", "relative/consumer.ts", "/"])("ignores imports with an invalid importer %j", async(importer) => {
		const plugin = generateSlicesRolldown({ slices: [] });
		await runOptions(plugin);

		const result = runResolveId(plugin, "./index.ts", importer);

		expect(result).toBeNull();
	});

	it("uses the current directory by default and preserves empty slice content", async() => {
		const plugin = generateSlicesRolldown({
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: "missing/**",
				},
			],
		});
		const result = await runOptions(plugin);

		expect(result).toStrictEqual({
			input: {
				models: "/project/models.ts",
				index: "/project/index.ts",
			},
		});
		expect(walk).toHaveBeenCalledExactlyOnceWith(root, {
			recursive: true,
			matcher: expect.any(Function),
		});
		expect(runLoad(plugin, "/project/models.ts")).toBe("");
		expect(runResolveId(plugin, "./models.ts", "/project/index.ts")).toBe("/project/models.ts");
		expect(runLoad(plugin, "/project/index.ts")).toBe("export * as Models from \"./models.ts\";");
	});

	it("generates only an empty main index when there are no slices", async() => {
		const plugin = generateSlicesRolldown({
			workDirectory: DPath.declareAbsolutePath("/other"),
			slices: [],
		});
		const result = await runOptions(plugin);

		expect(result).toStrictEqual({ input: { index: "/other/index.ts" } });
		expect(runLoad(plugin, "/other/index.ts")).toBe("");
		expect(runResolveId(plugin, "./index.ts", "/other/consumer.ts")).toBe("/other/index.ts");
		expect(walk).not.toHaveBeenCalled();
	});

	it("refreshes generated content when the options hook runs again", async() => {
		const plugin = generateSlicesRolldown({
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: "src/models/user.ts",
				},
			],
		});
		await runOptions(plugin);
		expect(runLoad(plugin, "/project/models.ts")).toBe("export * from \"./src/models/user.ts\";");
		walk.mockResolvedValueOnce(DEither.right("file-system-walk-directory", DGenerator.filter([], () => true)));
		await runOptions(plugin);

		expect(runLoad(plugin, "/project/models.ts")).toBe("");
	});

	it("rejects directory errors without generating a main index", async() => {
		const error = new DSFile.WalkDirectoryErrorNotFound(new Error("Missing project"));
		walk.mockResolvedValueOnce(DEither.left("file-system-walk-directory-error", error));
		const plugin = generateSlicesRolldown({
			slices: [
				{
					name: DCommon.cast("models"),
					pattern: "**",
				},
			],
		});

		await expect(runOptions(plugin)).rejects.toThrow();
		expect(runLoad(plugin, "/project/index.ts")).toBeNull();
		expect(runLoad(plugin, "/project/models.ts")).toBeNull();
	});
});
