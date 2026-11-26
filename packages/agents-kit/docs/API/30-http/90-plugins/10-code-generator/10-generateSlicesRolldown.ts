/**
 * @title generateSlicesRolldown
 *
 * Construire des modules partagés à partir de fichiers TypeScript sélectionnés.
 */
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
			slices: [{
				name: DCommon.cast("domains"),
				pattern: ["domains"],
			}],
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

// Exécuter : pnpm exec rolldown --config rolldown.slices.config.ts
// Le plugin parcourt récursivement les fichiers .ts sous workDirectory et
// sélectionne leurs chemins relatifs avec pattern. Chaque slice crée une entrée
// virtuelle qui réexporte les fichiers sélectionnés ; index les expose par
// namespace, ici Domains. Le nom d'une slice ne contient que des lettres.
// La configuration produit notamment domains.js, domains.d.ts, index.js et
// index.d.ts. Elle peut partager des DataStructures déjà exportées par les
// fichiers choisis : elle ne les déduit pas des routes. Les dépendances externes
// doivent être disponibles dans le projet qui utilise les fichiers générés.
