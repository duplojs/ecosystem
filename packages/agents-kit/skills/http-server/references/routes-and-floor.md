# Construire une route et suivre son floor

## Décrire les entrées

Commencer avec le builder de la famille de routes concernée. Pour une route sans préfixe commun, utiliser `useRouteBuilder`. `.extract(...)` décrit les sources attendues avec les data structures et leurs contraintes. Réutiliser les structures partagées du projet lorsqu'elles portent le même contrat.

L'extraction vérifie la donnée avant de poursuivre. Une entrée invalide produit la réponse d'extraction prévue par la configuration ; ne pas ajouter de parsing manuel ou de variante `OrThrow` dans les étapes suivantes.

Le placement dans le floor dépend de la forme déclarée :

- Une source décrite directement par une structure conserve sa clé de source : une structure sur `body` produit `floor.body`.
- Une source décrite par un objet de structures ajoute chaque propriété au floor : un objet sous `params` contenant `userId` produit `floor.userId`.

Voir [la récupération d'une ressource](examples/user-route.ts) pour une extraction par propriété et [la modification d'une ressource](examples/rename-user-route.ts) pour un body conservé sous sa clé.

## Enrichir le floor

Chaque étape reçoit le floor courant en premier argument. Les vérifications réussies peuvent y ajouter leur résultat sous la clé `indexing` ; un `cut` ajoute ou remplace les clés fournies à `output`. Le typage de l'étape suivante reflète ces garanties. Choisir les clés intentionnellement pour éviter d'écraser une donnée encore nécessaire.

Ne pas accéder manuellement à la requête brute pour récupérer une valeur que l'extraction ou une étape précédente garantit déjà. Ne pas ajouter de garde pour une absence exclue du type.

## Adapter un scénario avec `cut`

Utiliser `cut` pour une opération spécifique au flux courant : qualification métier nécessaire à ce scénario, appel applicatif avec adaptation de ses résultats ou préparation particulière.

Déclarer les réponses possibles dans le premier argument. Dans le callback, retourner `response(...)` pour terminer ou `output(...)` pour transmettre les données et continuer. Ne pas retourner une valeur brute en espérant enrichir le floor.

L'[exemple de modification](examples/rename-user-route.ts) adapte un résultat applicatif : l'échec attendu devient une réponse de conflit ; la réussite fournit la donnée à la suite. Les règles de modification restent dans le traitement applicatif. Si la même vérification et son interprétation se répètent, utiliser un checker et son preset comme décrit dans [les flux réutilisables](reusable-flows.md).

## Terminer avec le handler

Le handler termine la route et retourne la réponse positive lorsque les étapes précédentes ont réussi. Préparer les préconditions et traiter les échecs attendus en amont. Il peut appeler le traitement applicatif à cet endroit si ses préconditions garantissent le résultat attendu.

Un `ResponseContract` associe le statut HTTP, une `information` précise et le schéma du body éventuel. L'information distingue les issues de l'API, y compris celles qui ont le même statut. Retourner la réponse avec l'outil `response` fourni au callback et respecter le contrat déclaré.

Ne pas transformer le handler en orchestrateur métier. Dans une application organisée en couches, consommer les use cases résolus et les qualifications prévues par le domaine. Pour comprendre ces responsabilités, rechercher les frontières du Type-Driven Design et les fixtures d'infrastructure dans `docs/concepts.llms.md`.

Pour une représentation de body particulière, un flux ou un autre besoin HTTP, rechercher le mécanisme adapté dans le routeur conceptuel avant de modifier la réception ou l'envoi natifs.
