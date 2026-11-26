/**
 * @title generateRoutesTypesRolldown
 *
 * Générer les types des routes pour les utiliser dans un client HTTP.
 */
import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";
import { generateRoutesTypesRolldown } from "@duplojs/http/codeGenerator";
import * as DCommon from "@duplojs/lang/common";

// Exécuter depuis le dossier contenant cette configuration :
// pnpm exec rolldown --config rolldown.routes.config.ts
export default defineConfig({
	treeshake: true,
	external: [/^@duplojs\//],
	tsconfig: "../core/tsconfig.json",
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
		dir: "./routesTypes.generate",
		cleanDir: true,
	},
});

// Le plugin analyse les fichiers inclus par tsconfig dont le chemin correspond
// à pattern. Il reconnaît les appels .handler utilisés comme instructions et
// les variables de type Route, lorsqu'ils sont au premier niveau d'un fichier.
//
// Il remplace l'entrée Rolldown par un module virtuel routes.ts. Ce module
// exporte Routes, l'union des RouteDeclarationToContract des routes trouvées,
// ou never si aucune route n'est trouvée. Ici, le plugin dts écrit le fichier
// routesTypes.generate/routes.d.ts ; emitDtsOnly évite de produire du JavaScript.
