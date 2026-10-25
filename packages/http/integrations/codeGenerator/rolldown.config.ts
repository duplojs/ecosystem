import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import { generateRoutesTypesRolldown } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

export default defineConfig({
	treeshake: true,
	plugins: [
		generateRoutesTypesRolldown({
			tsconfig: DCommon.cast("../core/tsconfig.json"),
			pattern: ["routes"],
		}),
		...dts({
			generator: "tsgo",
			tsconfig: "../core/tsconfig.json",
			emitDtsOnly: true,
			tsgo: {
				moduleUrl: import.meta.resolve("typescript"),
				vfs: true,
			},
		}),
	],
	output: {
		dir: "./type.generate",
		cleanDir: true,
	},
});
