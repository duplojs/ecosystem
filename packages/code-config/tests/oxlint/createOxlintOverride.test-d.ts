import type { OxlintOverride } from "oxlint";
import { DOxlint } from "@scripts";

describe("createOxlintOverride types", () => {
	it("returns one native override and rejects unknown rules and invalid options", () => {
		const result = DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			customRules: {
				"no-eval": "error",
				"duplojs-plugin/prefer-import-path": [
					"error",
					{
						paths: {
							library: {
								replacement: "library/common",
								exceptions: ["Domain"],
							},
						},
					},
				],
			},
		});

		expectTypeOf(result).toEqualTypeOf<OxlintOverride>();

		DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			customRules: {
				// @ts-expect-error Unknown rule names must be rejected.
				"duplojs-plugin/unknown-rule": "error",
			},
		});

		DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			customRules: {
				// @ts-expect-error The prefer-import-path rule requires a paths mapping.
				"duplojs-plugin/prefer-import-path": ["error", {}],
			},
		});

		DOxlint.createOxlintOverride({
			// @ts-expect-error Oxlint globs must be a flat array of strings.
			files: [["**/*.ts"]],
		});
	});
});
