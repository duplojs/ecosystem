/**
 * @title staticPlugin
 *
 * Exposer un fichier ou un dossier sous des chemins HTTP.
 */
import { createHub } from "@duplojs/http";
import { staticPlugin } from "@duplojs/http/static";
import * as DSFile from "@duplojs/server/file";
import * as DPath from "@duplojs/lang/path";

const file = DSFile.createFileInterface(
	DPath.declarePath("public/logo.svg"),
);

const folder = DSFile.createFolderInterface(
	DPath.declarePath("public"),
);

const hub = createHub({ environment: "DEV" })
	.plug(
		staticPlugin(file, {
			path: "/logo.svg",
			cacheControlConfig: { maxAge: 3600 },
		}),
	)
	.plug(
		staticPlugin(folder, {
			prefix: "/assets",
			directoryFallBackFile: DPath.declareSegment("index.html"),
		}),
	);

// path et prefix acceptent également plusieurs chemins. Le dossier utilise un
// chemin générique ; directoryFallBackFile choisit le fichier servi pour un
// dossier. Les routes gèrent notamment 200 et 304, ainsi que 404 pour un fichier
// absent du dossier. La source est vérifiée au démarrage : une source absente
// ou de mauvais type provoque StaticPluginError. cacheControlConfig configure
// les directives de cache des réponses statiques.
