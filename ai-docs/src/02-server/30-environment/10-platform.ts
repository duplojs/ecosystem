/**
 * @title Capacités de plateforme
 *
 * Utilisation des abstractions communes et des connecteurs pour garder le code
 * applicatif indépendant du runtime.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DServerCommon from "@duplojs/server/common";
import * as DServerFile from "@duplojs/server/file";
import { createHub } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";

// Les capacités proches entre runtimes sont exposées par une même API.
const resourcePath: string & DPath.Path = DCommon.cast("/resources/config.json");

// DEither.Right<file-system-write-json-file, void> | DEither.Left<...> | ...
const writeJsonResult = await DServerFile.writeJsonFile(resourcePath, { version: 1.0 });

// DEither.Error<unknown> | DEither.Success<string & DPath.Path>
const currentWorkingDirectoryResult = DServerCommon.getCurrentWorkDirectory();

// string[]
const processArguments = DServerCommon.getProcessArguments();

const hub = createHub({
	environment: "DEV",
});

// Les capacités plus liées au runtime passent par un connecteur.
// Ici, le hub HTTP reste générique et le démarrage utilise le connecteur Node.
await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
