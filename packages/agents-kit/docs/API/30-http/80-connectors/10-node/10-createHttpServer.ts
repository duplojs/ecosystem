/**
 * @title createHttpServer
 *
 * Initialiser une application HTTP et créer son serveur Node HTTP ou HTTPS.
 */
import { createHub, useRouteBuilder } from "@duplojs/http";
import { createHttpServer } from "@duplojs/http/node";
import * as DPath from "@duplojs/lang/path";

// Le Hub est préparé avant de le transmettre au connecteur.
const healthRoute = useRouteBuilder("GET", "/health")
	.handler((__, { response }) => response.noContent("health.ok"));

const hub = createHub({
	environment: "DEV",
})
	.register(healthRoute);

// Le connecteur adapte les requêtes et réponses Node au routeur DuploJS,
// lit les bodies et prend en charge les fichiers, streams et SSE.
const server = await createHttpServer(
	hub,
	{
		host: "localhost",
		port: 3000,
		maxBodySize: "10mb",
		uploadFolder: DPath.declarePath("upload"),
		informationHeaderKey: "information",
		predictedHeaderKey: "predicted",
		fromHookHeaderKey: "from-hook",
		http: { keepAlive: true },
	},
);

// host et port sont requis par le type public, même si l'implémentation prévoit
// respectivement "localhost" et 80 comme valeurs de repli.
// maxBodySize limite par défaut les bodies texte et multipart : sa valeur par
// défaut est "50mb" ; un contrôleur de body peut définir sa propre limite.
// uploadFolder désigne le dossier des fichiers reçus, par défaut "upload".
// Les trois clés nomment les headers de réponse : leur valeur par défaut est
// respectivement "information", "predicted" et "from-hook".
// http transmet des options au serveur HTTP natif ; sans cette option, il est
// créé avec un objet vide. Si https est fourni, il sélectionne HTTPS et ses
// options sont transmises au serveur HTTPS à la place de celles de http.

// La promesse fournit le serveur Node après son initialisation et son écoute.
// L'application peut le fermer lors de son arrêt.
server.close();

// HTTPS : les données TLS proviennent de la configuration de l'application.
declare const tls: {
	key: string;
	cert: string;
};
const secureHub = createHub({
	environment: "PROD",
});

const secureServer = await createHttpServer(
	secureHub,
	{
		host: "0.0.0.0",
		port: 443,
		https: {
			key: tls.key,
			cert: tls.cert,
		},
	},
);

// En BUILD, le routeur et le serveur sont construits, mais listen() n'est pas
// appelé : le serveur retourné n'est pas encore accessible sur le réseau.
const buildHub = createHub({
	environment: "BUILD",
});
const buildServer = await createHttpServer(
	buildHub,
	{
		host: "localhost",
		port: 3000,
	},
);

// Les hooks du Hub encadrent aussi l'initialisation en BUILD.
