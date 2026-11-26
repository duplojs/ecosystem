/**
 * @title HttpClient.request, get, post, put, patch et delete
 *
 * Construire et lancer une requête avec ses données et options.
 */
import { createHttpClient } from "@duplojs/http/client";
import * as DCommon from "@duplojs/lang/common";

type Routes = {
	method: "POST";
	path: "/users/{id}";
	params: { id: number };
	query: { notify?: boolean };
	headers: { "x-source": string };
	body: { name: string };
	responses: {
		code: "200";
		information: "user.updated";
		body: { name: string };
	};
} | {
	method: "POST";
	path: "/documents";
	body: DCommon.TheFormData<{ title: string }>;
	responses: {
		code: "204";
		information: "document.created";
		body: undefined;
	};
};

const client = createHttpClient<Routes>({
	baseUrl: "https://api.example.com",
});

const update = client.post(
	"/users/{id}",
	{
		params: {
			id: 42,
		},
		query: {
			notify: true,
		},
		headers: {
			"x-source": "profile",
		},
		body: {
			name: "Ada",
		},
		initParams: {
			credentials: "include",
		},
		abortController: new AbortController(),
	},
);

const upload = client.request({
	method: "POST",
	path: "/documents",
	body: DCommon.createFormData({ title: "Report" }),
});

// request prend method et path dans l'objet ; les raccourcis prennent path
// puis les autres paramètres. get, post, put, patch et delete filtrent les
// chemins par méthode. Le contrat rend les champs requis ou facultatifs selon
// leur forme. hookParams transmet un contexte aux hooks.
// params remplace les segments {nom} ; query construit la chaîne de requête et
// répète les valeurs des tableaux. Ces opérations n'encodent pas les composants.
// Sans content-type explicite, un objet simple ou un tableau
// est sérialisé en JSON, une chaîne non vide en texte, et TheFormData utilise
// le format avancé DuploJS. Les valeurs falsy ne passent pas par cette détection.
// Un content-type fourni évite cette préparation automatique. Une requête sans
// body omet simplement body. initParams configure fetch ; le signal utilisé est
// celui de abortController, même si initParams contient aussi signal.
