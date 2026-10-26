import { createContentRoutesFiles, createTypescriptInstance, generateRouteIndex, generateRoutesTypesRolldown } from "@plugin-codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DInvocation from "@duplojs/lang/invocation";
import type * as DPath from "@duplojs/lang/path";
import { setEnvironment, TESTImplementation } from "@duplojs/server";
import type { Plugin } from "rolldown";
import { routesFiles, type TypescriptInstance } from "../_utils/instance";
import { runLoad, runOptions, runResolveId } from "../_utils/rolldown";

vi.mock("@plugin-codeGenerator/routesTypes/createTypescriptInstance", () => ({ createTypescriptInstance: vi.fn() }));
vi.mock("@plugin-codeGenerator/routesTypes/createContentRoutesFiles", () => ({ createContentRoutesFiles: vi.fn() }));
vi.mock("@plugin-codeGenerator/routesTypes/generateRouteIndex", () => ({ generateRouteIndex: vi.fn() }));

describe("generateRoutesTypesRolldown", () => {
	const root: string & DPath.Absolute = DCommon.cast("/project");
	const routePath: string & DPath.Path & DPath.Absolute = DCommon.cast("/project/src/users.ts");
	const indexPath: string & DPath.Path & DPath.Absolute = DCommon.cast("/project/routes.ts");
	const close = vi.fn(() => Promise.resolve());
	const instance = { api: { close } } as unknown as TypescriptInstance;

	beforeEach(() => {
		vi.resetAllMocks();
		setEnvironment("TEST");
		TESTImplementation.set("getCurrentWorkDirectory", () => DEither.success(root));
		vi.mocked(createTypescriptInstance).mockResolvedValue(DEither.success(instance));
		const files = routesFiles([[routePath, ["usersRoute"]]]);
		files.get(routePath)!.content = "export type usersRoute = unknown;";
		vi.mocked(createContentRoutesFiles).mockResolvedValue(DEither.success(files));
		vi.mocked(generateRouteIndex).mockResolvedValue(DInvocation.appendEvidence(
			[indexPath, "export type Routes = import('./src/users.ts').usersRoute;"],
			"generated-route-index-entry",
		));
	});

	afterEach(() => {
		TESTImplementation.clear();
		setEnvironment("NODE");
	});

	it("exposes a typed plugin with an initially empty virtual filesystem", () => {
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("tsconfig.json"),
			pattern: "src/**/*.ts",
		});

		type _Check = DCommon.ExpectType<typeof plugin, Plugin, "strict">;
		expect(plugin.name).toBe("@duplojs/http/codeGenerator:routesTypes");
		expect(runResolveId(plugin, routePath)).toBeUndefined();
		expect(runLoad(plugin, routePath)).toBeNull();
	});

	it("generates virtual files, replaces the input and preserves other options", async() => {
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("config/tsconfig.json"),
			pattern: ["/project/src/**/*.ts", "!/project/src/ignored.ts"],
		});
		const result = await runOptions(plugin, {
			input: "old.ts",
			external: ["external"],
			treeshake: false,
		});

		expect(createTypescriptInstance).toHaveBeenCalledExactlyOnceWith({ tsconfigPath: "/project/config/tsconfig.json" });
		expect(createContentRoutesFiles).toHaveBeenCalledWith(instance, { isRoutePath: expect.any(Function) });
		const matcher = vi.mocked(createContentRoutesFiles).mock.calls[0]![1].isRoutePath;
		expect(matcher(routePath)).toBe(true);
		expect(matcher(DCommon.cast("/project/src/users.js"))).toBe(false);
		expect(matcher(DCommon.cast("/project/src/ignored.ts"))).toBe(false);
		const generatedFiles = DEither.unwrapRight(await vi.mocked(createContentRoutesFiles).mock.results[0]!.value);
		expect(generateRouteIndex).toHaveBeenCalledWith(instance, generatedFiles);
		expect(close).toHaveBeenCalledOnce();
		expect(generateRouteIndex).toHaveBeenCalledBefore(close);
		expect(result).toStrictEqual({
			input: { routes: indexPath },
			external: ["external"],
			treeshake: false,
		});
		expect(runResolveId(plugin, routePath)).toBe(routePath);
		expect(runResolveId(plugin, indexPath)).toBe(indexPath);
		expect(runResolveId(plugin, "./src/users.ts")).toBeUndefined();
		expect(runLoad(plugin, routePath)).toBe("export type usersRoute = unknown;");
		expect(runLoad(plugin, indexPath)).toBe("export type Routes = import('./src/users.ts').usersRoute;");
		expect(runLoad(plugin, "missing.ts")).toBeNull();
	});

	it("replaces stale virtual files on a subsequent build and preserves empty content", async() => {
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("tsconfig.json"),
			pattern: "src/**/*.ts",
		});
		await runOptions(plugin);
		const replacementPath: string & DPath.Path & DPath.Absolute = DCommon.cast("/project/src/health.ts");
		const replacementFiles = routesFiles([[replacementPath, []]]);
		vi.mocked(createContentRoutesFiles).mockResolvedValueOnce(DEither.success(replacementFiles));
		await runOptions(plugin);

		expect(runResolveId(plugin, routePath)).toBeUndefined();
		expect(runLoad(plugin, routePath)).toBeNull();
		expect(runResolveId(plugin, replacementPath)).toBe(replacementPath);
		expect(runLoad(plugin, replacementPath)).toBe("");
		expect(close).toHaveBeenCalledTimes(2);
	});

	it("rejects an invalid TypeScript project before generating files", async() => {
		vi.mocked(createTypescriptInstance).mockResolvedValueOnce(DEither.left("missingProject"));
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("tsconfig.json"),
			pattern: "src/**/*.ts",
		});

		await expect(runOptions(plugin)).rejects.toThrow();
		expect(createContentRoutesFiles).not.toHaveBeenCalled();
		expect(generateRouteIndex).not.toHaveBeenCalled();
		expect(close).not.toHaveBeenCalled();
		expect(runLoad(plugin, indexPath)).toBeNull();
	});

	it("closes the API and rejects when the route index path is invalid", async() => {
		vi.mocked(generateRouteIndex).mockResolvedValueOnce(DEither.left("failToCreatePathKey"));
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("tsconfig.json"),
			pattern: "src/**/*.ts",
		});

		await expect(runOptions(plugin)).rejects.toThrow();
		expect(close).toHaveBeenCalledOnce();
		expect(runLoad(plugin, indexPath)).toBeNull();
	});

	it("propagates transformation failures without publishing virtual files", async() => {
		const error = new Error("Cannot transform routes");
		vi.mocked(createContentRoutesFiles).mockRejectedValueOnce(error);
		const plugin = generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("tsconfig.json"),
			pattern: "src/**/*.ts",
		});

		await expect(runOptions(plugin)).rejects.toBe(error);
		expect(generateRouteIndex).not.toHaveBeenCalled();
		expect(runLoad(plugin, routePath)).toBeNull();
	});
});
