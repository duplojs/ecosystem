/**
 * @title Hub.setDefaultBodyController
 *
 * Choisir le contrôleur de lecture du body utilisé par défaut pour les routes.
 */
import { controlBodyAsText, createHub } from "@duplojs/http";

// Le contrôleur texte est le défaut ; ici sa limite est personnalisée.
// Le connecteur doit fournir une implémentation de lecture compatible :
// sinon la construction du routeur échoue.
const hub = createHub({ environment: "DEV" })
	.setDefaultBodyController(controlBodyAsText({
		bodyMaxSize: "1mb",
	}));

// L'option bodyController d'une route remplace ce défaut pour cette route.
