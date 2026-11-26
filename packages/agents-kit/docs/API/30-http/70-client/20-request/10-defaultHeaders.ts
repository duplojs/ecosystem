/**
 * @title HttpClient.addDefaultHeader et addDefaultHeaders
 *
 * Fournir des headers communs fixes ou calculés à chaque requête.
 */
import { createHttpClient } from "@duplojs/http/client";

declare function getToken(): string | undefined;

const client = createHttpClient({
	baseUrl: "https://api.example.com",
});

client.addDefaultHeader("authorization", () => {
	const token = getToken();

	return token ? `Bearer ${token}` : undefined;
});

client.addDefaultHeaders({
	"x-application": "portal",
	"x-version": () => "1",
});

const request = client.get(
	"/profile",
	{
		headers: {
			"x-application": "admin",
		},
	},
);

// Les getters sont évalués à chaque requête. undefined omet le header par
// défaut ; null devient la chaîne "null". Les headers locaux remplacent les
// entrées par défaut de même clé. Les clés sont fusionnées comme des propriétés
// d'objet : utiliser une casse cohérente.
