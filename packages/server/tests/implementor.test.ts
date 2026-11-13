import type * as DCommon from "@duplojs/lang/common";
import type * as NodeFileSystem from "node:fs/promises";
import type * as NodeCrypto from "node:crypto";
import type * as NodeOs from "node:os";
import type * as NodePath from "node:path";
import { TESTImplementation, implementFunction, nodeCrypto, nodeFileSystem, nodeOs, nodePath, setEnvironment, SupportedEnvironment, OS, type currentOS } from "@scripts/implementor";

describe("implementor", () => {
	afterEach(() => {
		setEnvironment("NODE");
		TESTImplementation.clear();
		vi.clearAllMocks();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("includes TEST in supported environments", () => {
		expect(SupportedEnvironment.TEST).toBe("TEST");
	});

	it("merges the runtime OS types into a single enum", () => {
		type _CheckOS = DCommon.ExpectType<
			OS,
			Exclude<NodeJS.Platform, "win32" | "sunos"> | "windows" | "solaris" | "illumos",
			"strict"
		>;
		type _CheckCurrentOS = DCommon.ExpectType<typeof currentOS.value, OS, "strict">;

		expect(OS.windows).toBe("windows");
		expect(OS.solaris).toBe("solaris");
	});

	it.each([
		{
			platform: "win32",
			expected: "windows",
		},
		{
			platform: "sunos",
			expected: "solaris",
		},
		{
			platform: "linux",
			expected: "linux",
		},
		{
			platform: "darwin",
			expected: "darwin",
		},
		{
			platform: "aix",
			expected: "aix",
		},
		{
			platform: "android",
			expected: "android",
		},
		{
			platform: "freebsd",
			expected: "freebsd",
		},
		{
			platform: "openbsd",
			expected: "openbsd",
		},
		{
			platform: "netbsd",
			expected: "netbsd",
		},
		{
			platform: "haiku",
			expected: "haiku",
		},
		{
			platform: "cygwin",
			expected: "cygwin",
		},
	] as const)("normalizes Node platform $platform to $expected", async({ platform, expected }) => {
		vi.resetModules();
		vi.stubGlobal("Deno", undefined);
		vi.stubGlobal("Bun", undefined);
		vi.stubGlobal("process", {
			...process,
			platform,
		});
		const isolatedImplementor = await import("@scripts/implementor");
		isolatedImplementor.setEnvironment("NODE");

		expect(isolatedImplementor.currentOS.value).toBe(expected);
	});

	it.each(["darwin", "linux", "android", "windows", "freebsd", "netbsd", "aix", "solaris", "illumos"] as const)("preserves Deno OS %s and memoizes it", async(os) => {
		vi.resetModules();
		const getOS = vi.fn().mockReturnValue(os);
		vi.stubGlobal("Deno", {
			build: {
				get os() {
					return getOS();
				},
			},
		});
		const isolatedImplementor = await import("@scripts/implementor");
		isolatedImplementor.setEnvironment("DENO");

		expect(getOS).not.toHaveBeenCalled();
		expect(isolatedImplementor.currentOS.value).toBe(os);
		expect(isolatedImplementor.currentOS.value).toBe(os);
		expect(getOS).toHaveBeenCalledOnce();
	});

	it("stores and retrieves TEST implementations", () => {
		const implementation = vi.fn();

		TESTImplementation.set("exists", implementation);

		expect(TESTImplementation.get("exists")).toBe(implementation);

		TESTImplementation.clear();

		expect(TESTImplementation.get("exists")).toBeUndefined();
	});

	it("uses NODE implementation by default", () => {
		setEnvironment("NODE");
		const nodeImplementation = vi.fn().mockReturnValue("node-result");
		const runtimeFunction = implementFunction(
			"getCurrentWorkDirectory",
			{ NODE: nodeImplementation },
		);

		expect(runtimeFunction()).toBe("node-result");
		expect(nodeImplementation).toHaveBeenCalledTimes(1);
	});

	it("detects DENO environment at module initialization", async() => {
		vi.resetModules();
		vi.stubGlobal("Deno", {});
		vi.stubGlobal("Bun", undefined);

		const { implementFunction: isolatedImplementFunction } = await import("@scripts/implementor");
		const denoImplementation = vi.fn().mockReturnValue("deno-result");
		const runtimeFunction = isolatedImplementFunction(
			"getCurrentWorkDirectory",
			{
				NODE: vi.fn(),
				DENO: denoImplementation,
			},
		);

		expect(runtimeFunction()).toBe("deno-result");
		expect(denoImplementation).toHaveBeenCalledTimes(1);
	});

	it("detects BUN environment at module initialization", async() => {
		vi.resetModules();
		vi.stubGlobal("Deno", undefined);
		vi.stubGlobal("Bun", {});

		const { implementFunction: isolatedImplementFunction } = await import("@scripts/implementor");
		const bunImplementation = vi.fn().mockReturnValue("bun-result");
		const runtimeFunction = isolatedImplementFunction(
			"getCurrentWorkDirectory",
			{
				NODE: vi.fn(),
				BUN: bunImplementation,
			},
		);

		expect(runtimeFunction()).toBe("bun-result");
		expect(bunImplementation).toHaveBeenCalledTimes(1);
	});

	it("uses NODE fallback when no known runtime global is available", async() => {
		vi.resetModules();
		vi.stubGlobal("Deno", undefined);
		vi.stubGlobal("Bun", undefined);
		vi.stubGlobal("process", { versions: {} });

		const { implementFunction: isolatedImplementFunction } = await import("@scripts/implementor");
		const nodeImplementation = vi.fn().mockReturnValue("node-result");
		const runtimeFunction = isolatedImplementFunction(
			"getCurrentWorkDirectory",
			{ NODE: nodeImplementation },
		);

		expect(runtimeFunction()).toBe("node-result");
		expect(nodeImplementation).toHaveBeenCalledTimes(1);
	});

	it("uses explicit BUN and DENO implementations", () => {
		const bunImplementation = vi.fn().mockReturnValue("bun-result");
		const denoImplementation = vi.fn().mockReturnValue("deno-result");
		const runtimeFunction = implementFunction(
			"getCurrentWorkDirectory",
			{
				NODE: vi.fn(),
				BUN: bunImplementation,
				DENO: denoImplementation,
			},
		);

		setEnvironment("BUN");
		expect(runtimeFunction()).toBe("bun-result");

		setEnvironment("DENO");
		expect(runtimeFunction()).toBe("deno-result");

		expect(bunImplementation).toHaveBeenCalledTimes(1);
		expect(denoImplementation).toHaveBeenCalledTimes(1);
	});

	it("loads memoized node modules synchronously", () => {
		expect(nodeFileSystem.value).toHaveProperty("readFile");
		expect(nodeCrypto.value).toHaveProperty("randomUUID");
		expect(nodeOs.value).toHaveProperty("tmpdir");
		expect(nodePath.value.win32).toHaveProperty("normalize");

		type _CheckFileSystem = DCommon.ExpectType<typeof nodeFileSystem.value, typeof NodeFileSystem, "strict">;
		type _CheckCrypto = DCommon.ExpectType<typeof nodeCrypto.value, typeof NodeCrypto, "strict">;
		type _CheckOs = DCommon.ExpectType<typeof nodeOs.value, typeof NodeOs, "strict">;
		type _CheckPath = DCommon.ExpectType<typeof nodePath.value, typeof NodePath, "strict">;
	});

	it.each(["NODE", "DENO", "TEST", "BUN"] as const)("loads node modules synchronously and lazily once in %s", async(environment) => {
		vi.resetModules();
		const getBuiltinModule = vi.spyOn(process, "getBuiltinModule");
		const isolatedImplementor = await import("@scripts/implementor");

		isolatedImplementor.setEnvironment(environment);
		expect(getBuiltinModule).not.toHaveBeenCalled();

		const fs = isolatedImplementor.nodeFileSystem.value;
		const crypto = isolatedImplementor.nodeCrypto.value;
		const os = isolatedImplementor.nodeOs.value;
		const path = isolatedImplementor.nodePath.value;

		expect(fs).toHaveProperty("readFile");
		expect(crypto).toHaveProperty("randomUUID");
		expect(os).toHaveProperty("tmpdir");
		expect(path.win32).toHaveProperty("normalize");
		isolatedImplementor.setEnvironment(environment === "BUN" ? "NODE" : "BUN");
		expect(isolatedImplementor.nodeFileSystem.value).toBe(fs);
		expect(isolatedImplementor.nodeCrypto.value).toBe(crypto);
		expect(isolatedImplementor.nodeOs.value).toBe(os);
		expect(isolatedImplementor.nodePath.value).toBe(path);
		expect(getBuiltinModule).toHaveBeenCalledTimes(environment === "BUN" ? 0 : 4);
		if (environment !== "BUN") {
			expect(getBuiltinModule).toHaveBeenNthCalledWith(1, "node:fs/promises");
			expect(getBuiltinModule).toHaveBeenNthCalledWith(2, "node:crypto");
			expect(getBuiltinModule).toHaveBeenNthCalledWith(3, "node:os");
			expect(getBuiltinModule).toHaveBeenNthCalledWith(4, "node:path");
		}
	});

	it("falls back to NODE implementation for BUN and DENO when missing", () => {
		const nodeImplementation = vi.fn().mockReturnValue("node-result");
		const runtimeFunction = implementFunction(
			"getCurrentWorkDirectory",
			{ NODE: nodeImplementation },
		);

		setEnvironment("BUN");
		expect(runtimeFunction()).toBe("node-result");

		setEnvironment("DENO");
		expect(runtimeFunction()).toBe("node-result");

		expect(nodeImplementation).toHaveBeenCalledTimes(2);
	});

	it("uses the TEST implementation when TEST environment is selected", () => {
		setEnvironment("TEST");
		const testImplementation = vi.fn().mockReturnValue("test-result");
		const runtimeFunction = implementFunction(
			"getCurrentWorkDirectory",
			{ NODE: vi.fn() },
		);

		TESTImplementation.set("getCurrentWorkDirectory", testImplementation);

		expect(runtimeFunction()).toBe("test-result");
		expect(testImplementation).toHaveBeenCalledTimes(1);
	});

	it("throws when TEST environment implementation is missing", () => {
		setEnvironment("TEST");
		const runtimeFunction = implementFunction(
			"getCurrentWorkDirectory",
			{ NODE: vi.fn() },
		);

		expect(() => runtimeFunction()).toThrowError(
			"Missing function implementation \"getCurrentWorkDirectory\" in TEST environment.",
		);
	});
});
