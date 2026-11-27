/**
 * @title Cache applicatif
 *
 * Choisir la clé, contourner ou actualiser le stockage en mémoire du client.
 */
import { createHttpClient } from "@duplojs/http/client";

const client = createHttpClient({
	baseUrl: "https://api.example.com",
});

const first = client.get("/users", {
	query: {
		page: 1,
	},
	clientCache: "auto",
});

const refresh = client.get("/users", {
	query: {
		page: 1,
	},
	clientCache: "auto",
	refreshClientCache: true,
});

const bypass = client.get("/users", {
	clientCache: () => "users",
	bypassClientCache: true,
});

const custom = client.get("/users", {
	clientCache: ({
		path,
		hookParams,
	}) => `${path}:${String(hookParams?.userId)}`,
});

// Sans clientCache, aucun cache applicatif n'est utilisé. "auto" utilise
// autoCreateCacheKey : méthode, chemin avec paramètres substitués, query triée
// par clé et body sérialisés en JSON. Cette clé ignore les headers et hookParams :
// choisir une clé personnalisée pour séparer les utilisateurs. Un générateur
// retournant null désactive le cache pour cet appel ; auto retourne null si la
// sérialisation échoue. Le cache est un Map propre à chaque client, initialisable
// par clientCacheInitialValues, sans expiration automatique ni persistance.
// Si une réponse est trouvée dans le cache, fetch n'est pas appelé et fromCache
// vaut true. La réponse raw est reconstruite avec les headers : ce n'est pas le
// Response réseau d'origine.
// bypassClientCache évite lecture et écriture ; refreshClientCache ignore la
// lecture mais permet l'écriture. Seules les réponses ordinaires 2xx sont mises
// en cache, pas les réponses SSE ou stream. Les hooks continuent de s'exécuter.
// cache et initParams.cache configurent RequestInit.cache, distinct de ce Map.
