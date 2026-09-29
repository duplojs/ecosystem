/**
 * @title Plateformes
 *
 * DuploJS peut fonctionner sur plusieurs plateformes sans exposer directement
 * leurs API spécifiques dans le reste de l'application.
 *
 * Selon la fonctionnalité, cette intégration prend deux formes :
 * une API commune ou un connecteur dédié à la plateforme.
 */

import * as DCommon from "@duplojs/lang/common";
import type * as DPath from "@duplojs/lang/path";
import * as DServerCommon from "@duplojs/server/common";
import * as DServerFile from "@duplojs/server/file";

/**
 * Lorsque les plateformes proposent des capacités suffisamment proches,
 * une même API est exposée pour Node, Deno et Bun.
 *
 * C'est notamment le cas du système de fichiers et des opérations liées
 * au processus courant.
 */
const resourcePath: string & DPath.Path = DCommon.cast("/resources/config.json");

const writeJsonResult = await DServerFile.writeJsonFile(resourcePath, { version: 1.0 });
// writeJsonResult: DEither.Right<file-system-write-json-file, void> | DEither.Left<...> | ...

const currentWorkingDirectoryResult = DServerCommon.getCurrentWorkDirectory();
// currentWorkingDirectoryResult: DEither.Error<unknown> | DEither.Success<string & DPath.Path>

const processArguments = DServerCommon.getProcessArguments();
// processArguments: string[]

/**
 * Certaines fonctionnalités dépendent davantage de la plateforme.
 *
 * Dans ce cas, le cœur de l'application reste indépendant de celle-ci
 * et un connecteur se charge de l'intégrer à son environnement d'exécution.
 *
 * C'est le cas pour @duplojs/http qui pour manipuler l'interface HTTP de la platform
 * passe par un connecteur dedier.
 */

import { createHub } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";

const hub = createHub({
	environment: "DEV",
});

// Ici, l'application est démarrée avec le connecteur Node.
await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 1506,
	},
);
