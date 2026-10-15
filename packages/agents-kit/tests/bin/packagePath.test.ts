import { getPackagePath } from "@scripts/bin/packagePath";
import type * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import { findPackageJSON } from "node:module";

vi.mock("node:module", () => ({ findPackageJSON: vi.fn() }));

describe("getPackagePath", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

	it("resolves the package directory beside the package manifest", () => {
		vi.mocked(findPackageJSON).mockReturnValue("/packages/agents-kit/package.json");

		const result = getPackagePath();

		type _CheckResult = DCommon.ExpectType<typeof result, string & DPath.Path & DPath.Absolute, "strict">;

		expect(result).toBe("/packages/agents-kit");
		expect(findPackageJSON).toHaveBeenCalledExactlyOnceWith(".", expect.stringContaining("/scripts/bin/packagePath.ts"));
	});

	it.each([
		[undefined, null],
		["/invalid\0/package.json", "/invalid\0/package.json"],
		["/", null],
		["relative/package.json", "relative"],
	] as const)("throws for an unusable package path %j", (packagePath, expected) => {
		vi.mocked(findPackageJSON).mockReturnValue(packagePath);

		expect(getPackagePath).toThrow(expect.objectContaining({
			message: "@duplojs/agents-kit path was not found.",
			cause: expected,
		}));
	});

	it("propagates a native package discovery exception", () => {
		const failure = new Error("Package discovery failed");
		vi.mocked(findPackageJSON).mockImplementation(() => {
			throw failure;
		});

		expect(getPackagePath).toThrow(failure);
	});
});
