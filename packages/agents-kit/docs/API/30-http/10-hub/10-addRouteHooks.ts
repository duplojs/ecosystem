/**
 * @title Hub.addRouteHooks
 *
 * Enregistrer des hooks globaux pour les phases de traitement des routes.
 */
import { createHub } from "@duplojs/http";

// Un objet de hooks ou un tableau est ajouté aux hooks déjà enregistrés.
// next poursuit le traitement des hooks ; cet exemple intervient avant la route.
const hub = createHub({ environment: "DEV" })
	.addRouteHooks({
		beforeRouteExecution({ next }) {
			return next();
		},
	});

// Les hooks peuvent aussi être déclarés sur une route. L'ordre d'exécution
// dépend de l'endroit où ils sont déclarés.
