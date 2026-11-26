/**
 * @title createHookHubLifeCycle
 *
 * Définir beforeBuildRoute, beforeServerBuildRoutes, beforeStartServer, afterStartServer et serverError.
 */
import { createHookHubLifeCycle, createHub } from "@duplojs/http";

declare const monitoring: {
	reportServerError(error: unknown, url: string): Promise<void>;
};

// La fonction retourne l'objet fourni : l'enregistrement est explicite.
const startupHooks = createHookHubLifeCycle({
	beforeServerBuildRoutes(hub) {
		hub.setNotfoundHandler(({ response }) => response.notFound("route.missing"));
	},
	async serverError({ error, routerInitializationData, next }) {
		await monitoring.reportServerError(error, routerInitializationData.url);
		return next();
	},
});

const hub = createHub({ environment: "DEV" })
	.addHubHooks(startupHooks);

// beforeServerBuildRoutes reçoit le Hub et les paramètres HTTP avant la
// construction du routeur. beforeStartServer les reçoit après cette construction
// et avant l'initialisation du serveur. afterStartServer les reçoit après la
// fin de cette initialisation. Les paramètres comprennent notamment host,
// port, maxBodySize, uploadFolder et les noms des headers de réponse.
// Chaque callback peut retourner le Hub ou ne rien retourner, directement ou
// par une promesse. Les retours sont ignorés. Les callbacks sont attendus dans
// l’ordre ; ils peuvent modifier le Hub reçu ou produire d’autres effets.
// Une exception ou promesse rejetée interrompt cette séquence de démarrage.
//
// beforeBuildRoute reçoit chaque route enregistrée avant sa construction, et
// retourne une route ou une promesse de route. Les callbacks sont attendus dans
// l'ordre d'enregistrement : chacun reçoit la route retournée par le précédent.
// Cette phase appartient au Hub et ne traite pas une requête. Dans le routeur
// par défaut, la fonction de route est construite avec la route retournée ; le
// choix du lecteur de body et les chemins utilisent la route initiale.
//
// serverError reçoit { error, routerInitializationData, next, exit } pour une
// erreur survenue pendant l'exécution du routeur et non interceptée. routerInitializationData contient
// les données initiales du routeur, pas une réponse. Retourner next() poursuit
// les callbacks serverError ; exit() arrête cette liste. Les promesses sont
// attendues. Ni l'un ni l'autre ne construit ou n'envoie de réponse : le
// traitement de repli du connecteur est appelé ensuite, même après exit().
// Si un callback serverError échoue, le repli est également appelé. Les erreurs
// de construction du routeur et de démarrage ne passent pas par ce mécanisme.
