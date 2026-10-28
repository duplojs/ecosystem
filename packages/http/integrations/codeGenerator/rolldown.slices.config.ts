import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import { generateSlicesRolldown } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";

export default defineConfig({
	treeshake: true,
	external: [/^@duplojs\//],
	tsconfig: "../core/tsconfig.json",
	plugins: [
		generateSlicesRolldown({
			slices: [
				{
					name: DCommon.cast("domains"),
					pattern: ["domains"],
				},
			],
			workDirectory: DPath.resolveFrom(
				DSCommon.getCurrentDirectoryName(import.meta),
				[DCommon.cast("../core")],
			),
		}),
		...dts({
			generator: "tsgo",
			tsconfig: "../core/tsconfig.json",
			tsgo: {
				moduleUrl: import.meta.resolve("typescript"),
				vfs: true,
			},
		}),
	],
	output: {
		dir: "./slices.generate",
		cleanDir: true,
	},
});
