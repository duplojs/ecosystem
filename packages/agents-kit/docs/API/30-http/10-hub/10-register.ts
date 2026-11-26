/**
 * @title Hub.register
 *
 * Enregistrer une route, un itérable ou les valeurs d'un objet de routes.
 */
import { createHub, useRouteBuilder } from "@duplojs/http";

// handler finalise la déclaration ; elle ne l'enregistre pas dans ce Hub.
const healthRoute = useRouteBuilder("GET", "/health")
	.handler((__, { response }) => response.noContent("health.ok"));
const statusRoute = useRouteBuilder("GET", "/status")
	.handler((__, { response }) => response.noContent("status.ok"));

const hub = createHub({ environment: "DEV" });
hub.register(healthRoute);
hub.register([statusRoute]);
hub.register({
	health: healthRoute,
	status: statusRoute,
});

// register consomme immédiatement l'itérable et ajoute les routes à un Set :
// une même instance n'est présente qu'une fois. Il retourne le même Hub.
// Le routeStore est facultatif ; le connecteur construit le routeur plus tard,
// à partir des routes enregistrées avant cette construction.
