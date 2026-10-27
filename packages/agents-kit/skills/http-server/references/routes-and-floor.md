# Construire une route et suivre son floor

## Décrire les entrées

Commencer avec le builder de la famille de routes concernée. Pour une route sans préfixe commun, utiliser `useRouteBuilder`. `.extract(...)` décrit les sources attendues avec les data structures et leurs contraintes. Réutiliser les structures partagées du projet lorsqu'elles portent le même contrat.

L'extraction vérifie la donnée avant de poursuivre. Une entrée invalide appelle le callback d'échec du Hub, qui retourne par défaut `422 / extract-error` avec l'erreur en body. Pour adapter ce refus à une étape, passer un callback en second argument de `.extract` : il reçoit `response`, le `floor` courant et `dataStructureError`. Ne pas ajouter de parsing manuel ou de variante `OrThrow` dans les étapes suivantes.

Le placement dans le floor dépend de la forme déclarée :

- Une source décrite directement par une structure conserve sa clé de source : une structure sur `body` produit `floor.body`.
- Une source décrite par un objet de structures ajoute chaque propriété au floor : un objet sous `params` contenant `userId` produit `floor.userId`.

Voir [la route autonome](examples/minimal-route.ts) pour une extraction par propriété. Les exemples de [récupération](examples/user-route.ts) et de [modification d'une ressource](examples/rename-user-route.ts) montrent ensuite le raccordement applicatif et un body conservé sous sa clé. Leurs capacités déclarées avec `declare function` sont des contrats à remplacer par les implémentations du projet avant exécution.

## Enrichir le floor

Chaque étape reçoit le floor courant en premier argument. Les vérifications réussies peuvent y ajouter leur résultat sous la clé `indexing` ; un `cut` ajoute ou remplace les clés fournies à `output`. Le typage de l'étape suivante reflète ces garanties. Choisir les clés intentionnellement pour éviter d'écraser une donnée encore nécessaire.

Ne pas accéder manuellement à la requête brute pour récupérer une valeur que l'extraction ou une étape précédente garantit déjà. Ne pas ajouter de garde pour une absence exclue du type.

## Adapter un scénario avec `cut`

Utiliser `cut` pour une opération spécifique au flux courant : qualification métier nécessaire à ce scénario, appel applicatif avec adaptation de ses résultats ou préparation particulière.

Le callback de `.cut` reçoit le floor et les outils `response` et `output`. Retourner une réponse, par exemple `response.conflict(information)`, pour arrêter la route, ou `output(...)` pour enrichir le floor et poursuivre. Ne pas retourner une valeur brute en espérant enrichir le floor.

L'[exemple de modification](examples/rename-user-route.ts) adapte un résultat applicatif : l'échec attendu devient une réponse de conflit ; la réussite fournit la donnée à la suite. Les règles de modification restent dans le traitement applicatif. Si la même vérification et son interprétation se répètent, utiliser un checker et son preset comme décrit dans [les flux réutilisables](reusable-flows.md).

## Terminer avec le handler

Le handler termine la route et retourne la réponse positive lorsque les étapes précédentes ont réussi. Préparer les préconditions et traiter les échecs attendus en amont. Il peut appeler le traitement applicatif à cet endroit si ses préconditions garantissent le résultat attendu.

Le callback de `.handler` reçoit le floor et l'outil `response`. Retourner `response.ok(information, body)` pour envoyer le résultat, ou `response.noContent(information)` pour une réussite sans body. Choisir l'information pour identifier le résultat de l'opération : elle distingue les issues de l'API, y compris lorsqu'elles partagent le même statut HTTP.

Le type de chaque réponse est déduit de son statut, de son information et de son body. Les helpers ne valident ni ne filtrent le body au runtime ; préparer les données à exposer avant de les leur transmettre. Le handler dispose de tous les helpers de réponse. Dans les `cut` et les callbacks `otherwise`, seuls les helpers de refus sont disponibles : `4xx` et `internalServerError`.

Ne pas transformer le handler en orchestrateur métier. Dans une application organisée en couches, consommer les use cases résolus et les qualifications prévues par le domaine. Pour comprendre ces responsabilités, rechercher les frontières du Type-Driven Design et les fixtures d'infrastructure dans `docs/concepts.llms.md`.

Pour une représentation de body particulière, un flux ou un autre besoin HTTP, rechercher le mécanisme adapté dans le routeur conceptuel avant de modifier la réception ou l'envoi natifs.

## Partager les types avec un client

Pour créer un client à partir des routes du serveur, utiliser `RouteDeclarationToContract<typeof route>`. Ce type reprend les entrées et toutes les réponses de la route, y compris les refus des extractions et des vérifications exécutées dans les processus ou le preflight. Une union de types de routes permet de couvrir plusieurs endpoints. L'[exemple de client](examples/inferred-client.ts) montre comment partager ces types et sélectionner la réponse attendue, sans charger les modules serveur au runtime.

Pour générer une documentation OpenAPI, consulter `docs/concepts/02-server/20-http/50-open-api.ts` depuis le package installé. Cette ressource explique comment fournir les schémas de réponse au générateur.
