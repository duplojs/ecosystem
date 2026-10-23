import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import { generateRoutesTypesByInferenceRolldown } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

export default defineConfig({
	treeshake: true,
	plugins: [
		generateRoutesTypesByInferenceRolldown({
			tsconfig: DCommon.cast("../core/tsconfig.json"),
			pattern: ["routes"],
		}),
		...dts({
			generator: "tsgo",
			tsconfig: "../core/tsconfig.json",
			emitDtsOnly: true,
			tsgo: {
				moduleUrl: import.meta.resolve("@typescript/native-API"),
				vfs: true,
			},
		}),
	],
	output: {
		dir: "./type.generate",
		cleanDir: true,
	},
});
