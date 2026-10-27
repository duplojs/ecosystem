import { createTypescriptInstance } from "@plugin-codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { API, Snapshot } from "@typescript/native-API/async";
import { fixturePath, type TypescriptInstance } from "../_utils/instance";

describe("createTypescriptInstance", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("opens the configured project with its directory and evidence", async() => {
		const tsconfigPath = fixturePath("tsconfig.json");
		const result = await createTypescriptInstance({ tsconfigPath });
		const instance = DEither.unwrapByInformationOrThrow(result, "success");

		try {
			type _Check = DCommon.ExpectType<
				typeof instance,
				TypescriptInstance,
				"strict"
			>;
			type _WorkDirectory = DCommon.ExpectType<
				typeof instance.workDirectory,
				string & DPath.Path & DPath.Absolute,
				"strict"
			>;
			expect(instance.tsconfigPath).toBe(tsconfigPath);
			expect(instance.workDirectory).toBe(DPath.getParentFolderPath(tsconfigPath));
			expect(instance.api.getCurrentDirectory()).toBe(instance.workDirectory);
			expect(instance.snapshot.getConfiguredProject(tsconfigPath)).toBe(instance.project);
			expect(await instance.project.program.getSourceFile(fixturePath("handlers.ts"))).toBeDefined();
		} finally {
			await instance.api.close();
		}
	});

	it("rejects a path without a parent before creating a snapshot", async() => {
		const createSnapshot = vi.spyOn(API.prototype, "createSnapshot");
		const result = await createTypescriptInstance({ tsconfigPath: DCommon.cast("/") });
		const value = DEither.unwrapByInformationOrThrow(result, "invalidTsconfigPath");

		expect(value).toBeUndefined();
		expect(createSnapshot).not.toHaveBeenCalled();
	});

	it("reports a snapshot without the configured project", async() => {
		const getProject = vi.spyOn(Snapshot.prototype, "getConfiguredProject").mockReturnValue(undefined);
		const createSnapshot = vi.spyOn(API.prototype, "createSnapshot");

		try {
			const result = await createTypescriptInstance({ tsconfigPath: fixturePath("tsconfig.json") });
			const value = DEither.unwrapByInformationOrThrow(result, "missingProject");

			expect(value).toBeUndefined();
			expect(getProject).toHaveBeenCalledWith(fixturePath("tsconfig.json"));
			expect(createSnapshot).toHaveBeenCalledWith({ openProjects: [fixturePath("tsconfig.json")] });
		} finally {
			await (createSnapshot.mock.contexts[0] as API | undefined)?.close();
		}
	});

	it("propagates a snapshot creation failure", async() => {
		const error = new Error("Cannot open project");
		const createSnapshot = vi.spyOn(API.prototype, "createSnapshot").mockRejectedValue(error);

		try {
			await expect(createTypescriptInstance({ tsconfigPath: fixturePath("tsconfig.json") })).rejects.toBe(error);
		} finally {
			await (createSnapshot.mock.contexts[0] as API | undefined)?.close();
		}
	});
});
