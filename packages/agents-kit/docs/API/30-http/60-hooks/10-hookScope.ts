/**
 * @title Portée et ordre des hooks de route
 *
 * Associer les hooks aux routes et comprendre leur composition.
 */
import { createHub, usePreflightBuilder, useProcessBuilder } from "@duplojs/http";

const auditProcess = useProcessBuilder({
	hooks: [{
		beforeSendResponse({ currentResponse, next }) {
			currentResponse.setHeader("x-audit-policy", "enabled");
			return next();
		},
	}],
}).exports([]);

const preflight = usePreflightBuilder({
	hooks: [{
		beforeSendResponse({ currentResponse, next }) {
			currentResponse.setHeader("x-service", "accounts");
			return next();
		},
	}],
}).exec(auditProcess);

const route = preflight.useRouteBuilder("GET", "/accounts", {
	hooks: [{
		beforeSendResponse({ currentResponse, next }) {
			currentResponse.setHeader("cache-control", "no-store");
			return next();
		},
	}],
}).handler((__, { response }) => response.ok("accounts.available", { available: true }));

const hub = createHub({ environment: "DEV" })
	.addRouteHooks({
		beforeSendResponse({ currentResponse, next }) {
			currentResponse.setHeader("x-application", "portal");
			return next();
		},
	})
	.register(route);

// Les hooks de l'option locale concernent cette route. Ceux du preflight sont
// copiés dans chaque route créée par son builder. Les hooks d'un process sont
// associés aux routes qui l'exécutent, y compris par un preflight ou un process
// imbriqué : ils participent au cycle de la route, pas à un cycle autonome du
// process. addRouteHooks ajoute un objet ou un tableau aux hooks globaux du Hub
// et retourne le Hub ; un plugin peut aussi fournir ces hooks globaux.
//
// Pour chaque phase, le constructeur de route par défaut assemble les callbacks
// dans cet ordre : hooks locaux, hooks du preflight, hooks des preflight steps,
// hooks des steps de route, puis hooks globaux du Hub dans leur ordre d'ajout.
// Un process apporte d'abord ses hooks puis ceux de ses steps imbriquées. Les
// hooks des steps sont collectés à la construction, même si une réponse
// anticipée empêche ensuite l'exécution de la step correspondante.
//
// Le chemin normal est beforeRouteExecution, preflight steps, steps et handler,
// puis beforeSendResponse, sendResponse et afterSendResponse. Une réponse
// anticipée saute les steps restantes mais passe aux phases de réponse. Une
// exception pendant l'exécution passe par error avant ces phases ; une erreur
// pendant une phase de réponse remonte hors de la route. Les marqueurs next et
// exit contrôlent seulement les callbacks de leur phase.
