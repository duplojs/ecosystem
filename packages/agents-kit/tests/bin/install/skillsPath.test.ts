import "@scripts/bin/install/skillsPath";
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { findPackageJSON } from "node:module";

vi.mock("node:module", () => ({ findPackageJSON: vi.fn(() => "/packages/agents-kit/package.json") }));

describe("skillsPath", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("resolves the skills directory beside the package manifest", async() => {
		vi.mocked(findPackageJSON).mockReturnValue("/packages/agents-kit/package.json");

		const { skillsPath } = await import("@scripts/bin/install/skillsPath");

		type _CheckPath = DCommon.ExpectType<typeof skillsPath, string & DPath.Path, "strict">;

		expect(skillsPath).toBe("/packages/agents-kit/skills");
		expect(findPackageJSON).toHaveBeenCalledExactlyOnceWith(".", expect.stringContaining("/scripts/bin/install/skillsPath.ts"));
	});

	it.each([
		[undefined, null],
		["/invalid\0/package.json", "/invalid\0/package.json"],
		["/", null],
	] as const)("rejects an unusable package path %j", async(packagePath, cause) => {
		vi.mocked(findPackageJSON).mockReturnValue(packagePath);

		await expect(import("@scripts/bin/install/skillsPath")).rejects.toMatchObject({
			message: "@duplojs/agents-kit path was not found.",
			cause,
		});
	});

	it("propagates a package discovery error", async() => {
		const failure = new Error("Package discovery failed");
		vi.mocked(findPackageJSON).mockImplementation(() => {
			throw failure;
		});

		await expect(import("@scripts/bin/install/skillsPath")).rejects.toThrow(failure);
	});
});
