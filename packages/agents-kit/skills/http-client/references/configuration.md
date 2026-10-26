# Contrat et configuration du client

Le client HTTP est utilisable partout où une application effectue une requête HTTP, que l'API soit développée avec DuploJS ou avec une autre technologie. `createHttpClient<Routes>` accepte un type compatible avec `ServerRoute` : chaque route décrit sa méthode, son chemin, ses entrées et l'union de ses réponses. Les types peuvent être écrits à la main, importés ou composés.

Décrire précisément les requêtes et les réponses connues, y compris les erreurs contractuelles. Éviter de perdre ces garanties avec un client non paramétré ou des assertions sur les résultats. Le typage décrit le contrat supposé de l'API ; il n'effectue pas de validation runtime du body. Utiliser une data structure lorsque cette validation est nécessaire.

Créer un client par configuration d'API. Y placer l'URL de base, les options globales telles que `credentials` et `cache`, les headers par défaut et les hooks transversaux. Un header peut être calculé à chaque requête, par exemple pour récupérer le token courant. Les paramètres d'un appel peuvent préciser ses headers, ses options `initParams` et son `abortController`. Voir [un client pour une API externe](examples/external-client.ts), avec un contrat écrit à la main, sans header `information` ni `predicted`.

Pour les exemples complémentaires de configuration et d’envoi de formulaires, rechercher le client HTTP dans `docs/concepts.llms.md` du package installé.
