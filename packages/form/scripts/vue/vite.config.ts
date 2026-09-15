import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "unplugin-dts/vite";

const root = DPath.createOrThrow(import.meta.dirname);

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		vue(),
		dts({
			processor: "vue",
			tsconfigPath: DPath.resolveRelative([
				root,
				DCommon.infer("tsconfig.build.json"),
			]),
			pathsToAliases: true,
		}),
	],
	build: {
		outDir: DPath.resolveRelative([
			root,
			DCommon.infer("../../dist/vue"),
		]),
		cssCodeSplit: true,
		lib: {
			entry: {
				index: DPath.resolveRelative([
					root,
					DCommon.infer("index.ts"),
				]),

				"templates/grid/index": DPath.resolveRelative([
					root,
					DCommon.infer("templates/grid/index.ts"),
				]),

				"designSystem/index": DPath.resolveRelative([
					root,
					DCommon.infer("designSystem/index.ts"),
				]),
			},
			name: "form/vue",
			formats: [
				"es",
				"cjs",
			],
		},

		rolldownOptions: {
			external: [
				"vue",
				"@duplojs/lang",
			],
			output: {
				chunkFileNames: "chunks/[name]-[hash].js",
				assetFileNames: "assets/[name][extname]",
			},
		},
	},
});
