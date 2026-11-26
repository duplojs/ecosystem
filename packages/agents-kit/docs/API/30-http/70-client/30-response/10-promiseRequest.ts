/**
 * @title PromiseRequest et réponse HTTP
 *
 * Attendre une requête et distinguer réponse reçue et erreur de requête.
 */
import { createHttpClient } from "@duplojs/http/client";
import * as DEither from "@duplojs/lang/either";

const client = createHttpClient({
	baseUrl: "https://api.example.com",
});

const result = await client.get("/health");

if (DEither.isRight(result)) {
	const response = DEither.unwrapRight(result);
	// response.code est une chaîne, response.body est unknown sans contrat.
	const status = response.code;
} else {
	// request-error contient error et requestParams.
	const failure = DEither.unwrapLeft(result);
}

// PromiseRequest est une promesse enrichie : un await direct produit un Right
// "response" même pour une réponse HTTP 4xx/5xx, ou un Left "request-error"
// pour une erreur de transport ou de traitement. Les erreurs de parsing peuvent
// donc aussi aboutir à request-error.
// code est la chaîne du statut ; information vient du header configuré ; body
// est lu en JSON ou texte selon content-type, et vaut undefined pour un fichier
// attachment ou un autre contenu non pris en charge. raw est le Response fetch,
// headers ses Headers, requestParams les paramètres de l'échange et fromCache
// indique une réponse issue du cache. ok reflète fetch pour un statut inférieur
// à 500 et vaut null dès 500. raw permet notamment de traiter un téléchargement.
// predicted indique la présence du header configuré, quelle que soit sa valeur.
// Il ne valide ni le body ni l'authenticité de la réponse. Par défaut, une
// réponse sans ce marqueur reste accessible ici mais les sélections et hooks
// ciblés la refusent ; whenNotPredictedResponse permet de l'observer.
// disabledPredictedMode désactive cette condition pour les serveurs externes.
