/**
 * @title createHookRouteLifeCycle
 *
 * Définir beforeRouteExecution, error, beforeSendResponse, sendResponse et afterSendResponse.
 */
import { createHookRouteLifeCycle, useRouteBuilder } from "@duplojs/http";

declare const monitoring: {
	reportRouteError(error: unknown, path: string): Promise<void>;
};

const maintenanceHooks = createHookRouteLifeCycle({
	beforeRouteExecution({ request, response, next }) {
		if (request.headers["x-maintenance"] === "active") {
			return response("503", "service.maintenance", { retry: true });
		}

		return next();
	},
	beforeSendResponse({ currentResponse, next }) {
		currentResponse.setHeader("cache-control", "no-store");
		return next();
	},
	async error({ request, error, response }) {
		await monitoring.reportRouteError(error, request.url);
		return response("500", "account.unavailable");
	},
});

useRouteBuilder("GET", "/account", { hooks: [maintenanceHooks] })
	.handler((__, { response }) => response.ok("account.available", { available: true }));

// createHookRouteLifeCycle retourne l'objet typé sans l'enregistrer. Les hooks
// peuvent aussi être enregistrés pour toutes les routes avec Hub.addRouteHooks.
//
// beforeRouteExecution reçoit request, next, exit et response avant les
// preflight steps et les steps de route. next() passe au callback suivant ;
// exit() arrête les callbacks de cette phase puis exécute les steps. Retourner
// response(code, information, body?) arrête ces callbacks et saute les
// preflight steps, les steps et le handler. Les phases de réponse s'exécutent
// ensuite. Cette fabrique crée une HookResponse, distincte du ResponseHelper
// utilisé dans le handler ; code est une chaîne comme "503".
//
// error reçoit aussi error: unknown lorsqu'une exception échappe à
// beforeRouteExecution ou aux steps. next() essaie le callback error suivant ;
// exit() arrête cette liste. response(...) fournit la réponse à envoyer et
// arrête la liste. Sans réponse de hook, le moteur produit une réponse 500
// "server-error" contenant l'erreur. Les réponses anticipées normales des
// steps ne déclenchent pas error. Ce hook diffère de serverError du Hub.
//
// beforeSendResponse reçoit request et currentResponse avant l'envoi. Cette
// réponse expose code, information, body et headers, ainsi que setHeader,
// setHeaders et deleteHeader. Modifier les headers ici permet de les préparer
// avant le transport. sendResponse reçoit les mêmes paramètres pendant la
// phase d'envoi ; c'est un point de personnalisation avancée du transport.
// Le moteur et le connecteur installent leurs propres hooks : une application
// n'a pas à fournir systématiquement sendResponse.
//
// afterSendResponse reçoit les mêmes paramètres après la phase d'envoi. Cette
// phase ne garantit pas la fin physique de tous les flux ; modifier la réponse
// à ce stade ne la renvoie pas et ne modifie pas nécessairement les données
// déjà transmises. Ces trois phases acceptent uniquement next() ou exit(),
// éventuellement dans une promesse : next() poursuit la liste de la phase,
// exit() l'arrête, puis le moteur passe à la phase suivante. Un exit() placé
// avant un hook de transport peut empêcher son exécution.
//
// Les callbacks asynchrones sont attendus dans l'ordre. Une erreur des phases
// de réponse ne retourne pas dans error : elle remonte au mécanisme global du
// serveur.
