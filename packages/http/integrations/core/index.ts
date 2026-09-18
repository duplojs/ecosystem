import * as DCommon from "@duplojs/lang/common";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import { createHub, routeStore } from "@duplojs/http";
import { staticPlugin } from "@duplojs/http/static";
import { corsPlugin } from "@duplojs/http/cors";
import { cookiePlugin } from "@duplojs/http/cookie";
import * as DPath from "@duplojs/lang/path";
import "@duplojs/http/codeGenerator";

import "./routes";

const sourceFile = DSFile.createFileInterface(DCommon.cast("files/fakeFiles/superTextFile.txt"));
const sourceFolder = DSFile.createFolderInterface(DCommon.cast("files/fakeFiles"));

DSCommon.setCurrentWorkingDirectoryOrThrow(DPath.resolveRelative([DPath.createOrThrow(import.meta.dirname), DCommon.cast("..")]));

export const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll())
	.plug(
		staticPlugin(sourceFile, { path: "/static-file" }),
	)
	.plug(
		staticPlugin(sourceFolder, {
			prefix: "/static-folder",
			directoryFallBackFile: DCommon.cast("1mb.jpg"),
		}),
	)
	.plug(
		corsPlugin({
			allowOrigin: "localhost",
			allowHeaders: ["content-type", "accept"],
			allowMethods: true,
			credentials: true,
			exposeHeaders: ["info"],
			maxAge: 0,
		}),
	)
	.plug(
		cookiePlugin(),
	);
