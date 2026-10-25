import { generateRouteIndex } from "@plugin-codeGenerator";
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DInvocation from "@duplojs/lang/invocation";
import { fixturePath, openProject, routesFiles, type TypescriptInstance } from "../_utils/instance";

describe("generateRouteIndex", () => {
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

	it("builds an ordered union with relative imports for every route", async() => {
		const files = routesFiles([
			[fixturePath("nested/users.ts"), ["usersRoute", "createUserRoute"]],
			[fixturePath("empty.ts"), []],
			[fixturePath("../health.ts"), ["healthRoute"]],
		]);
		const result = await generateRouteIndex(instance, files);
		const entry = DEither.whenIsLeft(result, () => {
			throw new Error("Expected a generated route index");
		});

		type _Check = DCommon.ExpectType<
			typeof entry,
			DInvocation.GetEvidenceResult<typeof generateRouteIndex, "generated-route-index-entry">,
			"strict"
		>;
		expect(entry).toStrictEqual([
			fixturePath("routes.ts"),
			"export type Routes = import(\"./nested/users.ts\").usersRoute | import(\"./nested/users.ts\").createUserRoute | import(\"./../health.ts\").healthRoute;\n",
		]);
	});

	it.each([
		{
			name: "no files",
			entries: [],
		},
		{
			name: "a file without routes",
			entries: [[fixturePath("empty.ts"), []]],
		},
	] as const)("emits never for $name", async({ entries }) => {
		const result = await generateRouteIndex(instance, routesFiles(entries));
		const entry = DEither.whenIsLeft(result, () => {
			throw new Error("Expected a generated route index");
		});

		expect(entry).toStrictEqual([fixturePath("routes.ts"), "export type Routes = never;\n"]);
	});

	it("exports the single route type when only one route is present", async() => {
		const files = routesFiles([[fixturePath("variables.ts"), ["usersRoute"]]]);
		const result = await generateRouteIndex(instance, files);
		const entry = DEither.whenIsLeft(result, () => {
			throw new Error("Expected a generated route index");
		});

		expect(entry).toStrictEqual([
			fixturePath("routes.ts"),
			"export type Routes = import(\"./variables.ts\").usersRoute;\n",
		]);
	});

	it("returns an explicit error when the canonical path cannot become a path key", async() => {
		vi.spyOn(instance.api, "getCanonicalFileName").mockReturnValue("relative/routes.ts");
		const printFile = vi.spyOn(instance.api.printer, "printFile");
		const result = await generateRouteIndex(instance, routesFiles());
		const value = DEither.unwrapByInformationOrThrow(result, "failToCreatePathKey");

		expect(value).toBeUndefined();
		expect(printFile).not.toHaveBeenCalled();
	});

	it("propagates printer failures", async() => {
		const error = new Error("Cannot print route index");
		vi.spyOn(instance.api.printer, "printFile").mockRejectedValue(error);

		await expect(generateRouteIndex(instance, routesFiles())).rejects.toBe(error);
	});
});
