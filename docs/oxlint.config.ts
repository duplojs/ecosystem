import { defineConfig } from "oxlint";
import { openConfig } from "@duplojs/code-config/oxlint";

export default defineConfig({
	plugins: ["vue"],
	extends: [openConfig],
	rules: {
		"duplojs-plugin/prefer-namespace-import": [
			"error",
			{
				paths: {
					"@duplojs-v1/lang/common": "DCommon",
					"@duplojs-v1/lang/kind": "DKind",
					"@duplojs-v1/lang/object": "DObject",
					"@duplojs-v1/lang/string": "DString",
					"@duplojs-v1/lang/either": "DEither",
					"@duplojs-v1/lang/dataStructure": "DDataStructure",
					"@duplojs-v1/lang/array": "DArray",
					"@duplojs-v1/lang/chrono": "DChrono",
					"@duplojs-v1/lang/tuple": "DTuple",
					"@duplojs-v1/lang/number": "DNumber",
					"@duplojs-v1/lang/modeling": "DModeling",
					"@duplojs-v1/lang/pattern": "DPattern",
					"@duplojs-v1/lang/generator": "DGenerator",
					"@duplojs-v1/lang/invocation": "DInvocation",
					"@duplojs-v1/lang/path": "DPath",
					"@duplojs-v1/lang/printer": "DPrinter",
					"@duplojs-v1/server/file": "DSFile",
					"@duplojs-v1/server/common": "DSCommon",
					"@duplojs-v1/server/dataStructure": "DSDataStructure",
					"@duplojs-v1/server/command": "DSCommand",
				},
			},
		],
		"duplojs-plugin/no-restricted-import": [
			"error",
			{
				paths: {
					"@duplojs-v1/lang": "@duplojs-v1/lang/common",
					"@duplojs-v1/server": "@duplojs-v1/server/common",
				},
			},
		],
	},
	ignorePatterns: [
		".vitepress/cache/**",
		".vitepress/dist/**",
		".vitepress/.temp/**",
		"libs/**",
	],
});
