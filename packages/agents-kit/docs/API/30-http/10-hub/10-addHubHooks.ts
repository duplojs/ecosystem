/**
 * @title Hub.addHubHooks
 *
 * Enregistrer des hooks du cycle de vie global du Hub et du serveur.
 */
import { createHub } from "@duplojs/http";

// Un objet de hooks ou un tableau est ajouté aux hooks déjà enregistrés.
// beforeServerBuildRoutes intervient avant la construction du routeur ;
// beforeStartServer et afterStartServer encadrent le démarrage du serveur.
const hub = createHub({ environment: "DEV" })
	.addHubHooks({
		beforeServerBuildRoutes(currentHub) {
			return currentHub;
		},
	});
