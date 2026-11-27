/**
 * @title Hooks et intercepteurs
 *
 * Transformer ou observer un échange globalement ou pour une seule requête.
 */
import { createHttpClient } from "@duplojs/http/client";

declare function record(code: string): void;

const client = createHttpClient({
	baseUrl: "https://api.example.com",
});

client.addRequestHook((params) => ({
	...params,
	headers: {
		...params.headers,
		"x-source": "portal",
	},
}));

client.addResponseHook((response) => response);
client.addCodeHook("500", (response) => record(response.code));

const request = client
	.get("/profile")
	.addRequestInterceptor((params) => ({
		...params,
		headers: {
			...params.headers,
			"x-page": "profile",
		},
	}))
	.addResponseInterceptor((response) => response)
	.whenCode("500", (response) => record(response.code));

// Les hooks du client sont distincts des hooks du serveur.
// addRequestHook et addResponseHook transforment leur valeur et retournent celle
// transmise à la suite. Les intercepteurs locaux ont le même rôle pour un appel.
// Pour chaque phase, les callbacks locaux précèdent les globaux, dans leur ordre
// d'enregistrement ; les promesses sont attendues séquentiellement.
// addInformationHook, addCodeHook, addInformationalResponseTypeHook,
// addSuccessfulResponseTypeHook, addRedirectionResponseTypeHook,
// addClientErrorResponseTypeHook, addServerErrorResponseTypeHook,
// addExpectedResponseHook, addNotPredictedResponseHook et addErrorHook observent
// l'échange. Les méthodes locales when* observent une seule requête.
// Après la réponse générale : famille, expected pour 2xx/4xx, information puis
// code. En mode predicted actif, une réponse non marquée passe uniquement par les
// hooks généraux de réponse puis notPredicted. Les hooks d'erreur reçoivent
// error et requestParams. Ils traitent les exceptions du cycle de hooks ; une
// erreur fetch ou de parsing capturée dans un Left request-error ne les déclenche
// pas nécessairement. Traiter toujours ce Left. hookParams porte le contexte.
