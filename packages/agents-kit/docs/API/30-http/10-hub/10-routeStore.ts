/**
 * @title routeStore
 *
 * Récupérer les routes déclarées pour les enregistrer dans un Hub.
 */
import { createHub, routeStore } from "@duplojs/http";

// handler finalise chaque route et l'ajoute automatiquement au store global,
// sauf si sa déclaration porte IgnoreByRouteStoreMetadata. Charger les modules
// de routes avant cet appel pour que leurs déclarations soient exécutées.
// Un import de type n'exécute pas le module ; aucun fichier n'est découvert
// automatiquement.
const hub = createHub({ environment: "DEV" })
	.register(routeStore.getAll());

// getAll retourne un générateur sur le Set global. register le consomme ici :
// les routes ajoutées ensuite au store ne sont pas ajoutées à ce Hub.
// Pour plusieurs Hubs aux routes distinctes, préférer des enregistrements explicites.
