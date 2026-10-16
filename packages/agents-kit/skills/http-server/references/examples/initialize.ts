/**
 * @title Assembler le Hub et le connecteur de l'environnement.
 *
 * Exécuter les déclarations de routes avant de consommer le store global.
 */
import "./user-route";
import "./rename-user-route";
import "./protected-route";
import { createHub, routeStore } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import * as DSCommon from "@duplojs/server/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";

// Une configuration invalide arrête l'initialisation avant l'écoute HTTP.
const environment = await DSCommon.environmentVariableOrThrow({
	ENVIRONMENT: DDataStructure.literal(["DEV", "PROD"]),
	HOST: DDataStructure.literal(["localhost", "127.0.0.1", "0.0.0.0"]),
	PORT: DDataStructure.number([
		DDataStructure.integer(),
		DDataStructure.greaterThanOrEqual(1),
		DDataStructure.lessThanOrEqual(65535),
	]),
});

const hub = createHub({ environment: environment.ENVIRONMENT })
	.register(routeStore.getAll());

await createHttpServer(hub, {
	host: environment.HOST,
	port: environment.PORT,
});
