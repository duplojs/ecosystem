import * as DCommon from "@duplojs/lang/common";
import * as DPattern from "@duplojs/lang/pattern";

export interface ServerFunction {}

export const SupportedEnvironment = DCommon.createEnum(["BUN", "DENO", "NODE", "TEST"]);
export type SupportedEnvironment = DCommon.GetEnumValue<typeof SupportedEnvironment>;

const SymbolEnvironmentStore = Symbol("environmentStore");
type SymbolEnvironmentStore = typeof SymbolEnvironmentStore;

declare module "@duplojs/lang" {
	interface GlobalStore {
		[SymbolEnvironmentStore]: SupportedEnvironment;
	}
}

const environmentStoreHandler = DCommon.createGlobalStore(
	SymbolEnvironmentStore,
	DCommon.justExec(() => {
		if (typeof Deno !== "undefined") {
			return "DENO";
		}
		if (typeof Bun !== "undefined") {
			return "BUN";
		}
		if (typeof process !== "undefined" && process.versions?.node) {
			return "NODE";
		}

		return "NODE";
	}),
);

export function setEnvironment(environment: SupportedEnvironment) {
	environmentStoreHandler.set(environment);
}

export namespace TESTImplementation {
	const store = new Map<string, DCommon.AnyFunction>();

	export function clear() {
		store.clear();
	}

	export function set<
		GenericFunctionName extends keyof ServerFunction,
	>(
		functionName: GenericFunctionName,
		theFunction: ServerFunction[GenericFunctionName],
	): ServerFunction[GenericFunctionName] {
		store.set(functionName, theFunction);

		return theFunction;
	}

	export function get<
		GenericFunctionName extends keyof ServerFunction,
	>(
		functionName: GenericFunctionName,
	): ServerFunction[GenericFunctionName] | undefined {
		return store.get(functionName);
	}
}

export function implementFunction<
	GenericFunctionName extends keyof ServerFunction,
>(
	functionName: GenericFunctionName,
	theFunctions: {
		NODE: ServerFunction[GenericFunctionName];
		BUN?: ServerFunction[GenericFunctionName];
		DENO?: ServerFunction[GenericFunctionName];
	},
): ServerFunction[GenericFunctionName] {
	const environmentFunctions: Record<
		SupportedEnvironment,
		DCommon.AnyFunction
	> = {
		NODE: theFunctions.NODE,
		BUN: theFunctions.BUN ||= theFunctions.NODE,
		DENO: theFunctions.DENO ||= theFunctions.NODE,
		get TEST() {
			const theFunction = TESTImplementation.get(functionName);

			if (!theFunction) {
				throw new Error(`Missing function implementation "${functionName}" in TEST environment.`);
			}

			return theFunction;
		},
	};

	return (...args: unknown[]) => environmentFunctions[environmentStoreHandler.value](...args);
}

const requireModule = DCommon.memo<typeof process.getBuiltinModule>(
	() => DPattern.matchWithStringOtherwise(
		environmentStoreHandler.value,
		{
			BUN: () => require,
		},
		() => process.getBuiltinModule,
	),
);

export const nodeFileSystem = DCommon.memo(
	() => requireModule.value("node:fs/promises"),
);

export const nodeCrypto = DCommon.memo(
	() => requireModule.value("node:crypto"),
);

export const nodeOs = DCommon.memo(
	() => requireModule.value("node:os"),
);
