import type * as AST from "@typescript/native-API/ast";
import { toRootedFilePath } from "@typescript/native-API/path";
import { createContentRoutesFiles } from "@plugin-codeGenerator";
import * as DArray from "@duplojs/lang/array";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import { fixturePath, openProject, type RoutesFiles, type TypescriptInstance } from "@test-utils/instance";

describe("createContentRoutesFiles", () => {
	let instance = undefined as unknown as TypescriptInstance;

	beforeAll(async() => {
		instance = await openProject();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(async() => {
		await instance.api.close();
	});

	it("names standalone handlers and exports their refined route types", async() => {
		const path = fixturePath("handlers.ts");
		const source = await instance.project.program.getSourceFile(path);
		const result = await createContentRoutesFiles(instance, { isRoutePath: DPath.createMatcher(path) });
		const files = DEither.unwrapRightOrThrow(result);

		type _Check = DCommon.ExpectType<typeof files, RoutesFiles, "strict">;
		expect(files.size).toBe(1);
		expect(DArray.map(files.get(path)!.variablesName, ({ text }) => text)).toStrictEqual([
			"__duploRoute_0_1",
			"__duploRoute_0_2",
		]);
		expect(files.get(path)!.content).toContain("import { ResponseContract, useRouteBuilder } from \"@duplojs/http\";");
		expect(files.get(path)!.content).toContain("const __duploRoute_0_1 = useRouteBuilder(\"GET\", \"/users\").handler(");
		expect(files.get(path)!.content).toContain("const __duploRoute_0_2 = useRouteBuilder(\"POST\", \"/users\").handler(");
		expect(files.get(path)!.content).toContain("export type __duploRoute_0_1 = import(\"@duplojs/http\").RouteDeclarationToContract<typeof __duploRoute_0_1>;");
		expect(files.get(path)!.content).toContain("export type __duploRoute_0_2 = import(\"@duplojs/http\").RouteDeclarationToContract<typeof __duploRoute_0_2>;");
		expect(source?.statements).toHaveLength(3);
	});

	it("preserves unrelated statements and ignores foreign, unknown and non-route handlers", async() => {
		const path = fixturePath("unrelated.ts");
		const source = (await instance.project.program.getSourceFile(path))!;
		const originalContent = await instance.api.printer.printFile(source, { preserveSourceNewlines: true });
		const result = await createContentRoutesFiles(instance, { isRoutePath: DPath.createMatcher(path) });
		const files = DEither.unwrapRightOrThrow(result);

		expect(files.get(path)!.variablesName).toStrictEqual([]);
		expect(DString.trim(files.get(path)!.content)).toBe(DString.trim(originalContent));
	});

	it("exports a named route declared in a variable statement", async() => {
		const path = fixturePath("variables.ts");
		const result = await createContentRoutesFiles(instance, { isRoutePath: DPath.createMatcher(path) });
		const files = DEither.unwrapRightOrThrow(result);

		expect(DArray.map(files.get(path)!.variablesName, ({ text }) => text)).toStrictEqual(["usersRoute"]);
		expect(files.get(path)!.content).toContain("export type usersRoute = import(\"@duplojs/http\").RouteDeclarationToContract<typeof usersRoute>;");
		expect(files.get(path)!.content).toContain("export const usersRoute = ");
		expect(files.get(path)!.content).not.toContain("__duploRoute_");
	});

	it("uses the file position to keep generated identifiers unique", async() => {
		const handlersPath = fixturePath("handlers.ts");
		const secondPath = fixturePath("second.ts");
		const source = (await instance.project.program.getSourceFile(handlersPath))!;
		vi.spyOn(instance.project.program, "getSourceFileNames").mockResolvedValue([
			toRootedFilePath(handlersPath, instance.api.getCurrentDirectory()),
			toRootedFilePath(secondPath, instance.api.getCurrentDirectory()),
		]);
		vi.spyOn(instance.project.program, "getSourceFile").mockResolvedValue(source);
		const result = await createContentRoutesFiles(instance, { isRoutePath: () => true });
		const files = DEither.unwrapRightOrThrow(result);

		expect(DArray.map(files.get(secondPath)!.variablesName, ({ text }) => text)).toStrictEqual([
			"__duploRoute_1_1",
			"__duploRoute_1_2",
		]);
	});

	it("filters invalid, relative and unmatched paths and normalizes accepted paths", async() => {
		const path = fixturePath("unrelated.ts");
		vi.spyOn(instance.project.program, "getSourceFileNames").mockResolvedValue([
			"bad\0path",
			"relative.ts",
			fixturePath("ignored.ts"),
			`${fixturePath("nested")}/../unrelated.ts`,
		] as unknown as readonly AST.RootedFilePath[]);
		const getSourceFile = vi.spyOn(instance.project.program, "getSourceFile");
		const result = await createContentRoutesFiles(instance, {
			isRoutePath: DPath.createMatcher([path, "relative.ts"]),
		});
		const files = DEither.unwrapRightOrThrow(result);

		expect(files.size).toBe(1);
		expect(files.has(path)).toBe(true);
		expect(getSourceFile).toHaveBeenCalledExactlyOnceWith(path);
	});

	it("skips source files that disappeared from the program", async() => {
		const missingFile = toRootedFilePath(fixturePath("missing.ts"), instance.api.getCurrentDirectory());
		vi.spyOn(instance.project.program, "getSourceFileNames").mockResolvedValue([missingFile]);
		vi.spyOn(instance.project.program, "getSourceFile").mockResolvedValue(undefined);
		const printFile = vi.spyOn(instance.api.printer, "printFile");
		const result = await createContentRoutesFiles(instance, { isRoutePath: () => true });
		const files = DEither.unwrapRightOrThrow(result);

		expect(files.size).toBe(0);
		expect(printFile).not.toHaveBeenCalled();
	});

	it("returns an empty map when no files match", async() => {
		const getSourceFile = vi.spyOn(instance.project.program, "getSourceFile");
		const result = await createContentRoutesFiles(instance, { isRoutePath: () => false });
		const files = DEither.unwrapRightOrThrow(result);

		expect(files.size).toBe(0);
		expect(getSourceFile).not.toHaveBeenCalled();
	});

	it("propagates type checker failures", async() => {
		const error = new Error("Cannot resolve signature");
		vi.spyOn(instance.project.checker, "getResolvedSignature").mockRejectedValue(error);

		await expect(createContentRoutesFiles(instance, {
			isRoutePath: DPath.createMatcher(fixturePath("handlers.ts")),
		})).rejects.toBe(error);
	});

	it("propagates printer failures", async() => {
		const error = new Error("Cannot print routes");
		vi.spyOn(instance.api.printer, "printFile").mockRejectedValue(error);

		await expect(createContentRoutesFiles(instance, {
			isRoutePath: DPath.createMatcher(fixturePath("unrelated.ts")),
		})).rejects.toBe(error);
	});
});
