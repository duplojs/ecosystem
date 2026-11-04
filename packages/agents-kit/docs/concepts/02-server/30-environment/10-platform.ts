/**
 * @title Capacités de plateforme
 *
 * Utilisation des abstractions communes et des connecteurs pour garder le code
 * applicatif indépendant du runtime.
 */
import * as DCommon from "@duplojs/lang/common";
import type * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";
import { createHub } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";

// Les capacités proches entre runtimes sont exposées par une même API.
const resourcePath: string & DPath.Path = DCommon.cast("/resources/config.json");

const writeJsonResult = await DSFile.writeJsonFile(resourcePath, { version: 1.0 });
type _CheckWriteJsonResult = DCommon.ExpectType<typeof writeJsonResult, DSFile.WriteJsonFileResult, "strict">;

const currentWorkingDirectoryResult = DSCommon.getCurrentWorkDirectory();
type _CheckCurrentWorkingDirectoryResultLine21 = DCommon.ExpectType<
	typeof currentWorkingDirectoryResult,
	DEither.Error<unknown> | DEither.Success<string & DPath.Absolute>,
	"strict"
>;

const processArguments = DSCommon.getProcessArguments();
type _CheckProcessArgumentsLine24 = DCommon.ExpectType<
	typeof processArguments,
	string[],
	"strict"
>;

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
