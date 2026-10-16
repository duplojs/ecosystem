# Initialiser et enregistrer les routes

## Hub et connecteur

Le `Hub` décrit l'application HTTP sans dépendre de son serveur natif. Il rassemble les routes et les capacités ajoutées par les plugins. `.plug(...)` ajoute un plugin ; `.register(...)` enregistre une route, un ensemble itérable ou un objet de routes.

Le connecteur fournit l'exécution propre au runtime et lance le cycle de vie du Hub. Choisir celui adapté à l'environnement et vérifier son export public dans la documentation. L'[exemple d'initialisation sur Node](examples/initialize.ts) utilise `createHttpServer` depuis `@duplojs/http/node`.

Conserver cette initialisation au point d'entrée. Les modules de routes déclarent les flux et les traitements ; ils ne démarrent pas chacun un serveur.

## Charger la configuration d'environnement

Récupérer et valider les variables d'environnement au démarrage avec `DSCommon.environmentVariableOrThrow`, depuis `@duplojs/server/common`. Décrire leur contrat avec les data structures, puis transmettre les valeurs typées au Hub et au connecteur.

L'[exemple d'initialisation](examples/initialize.ts) utilise ainsi `ENVIRONMENT` pour configurer le Hub, puis `HOST` et `PORT` pour démarrer le serveur. Une variable absente ou invalide interrompt l'initialisation avant l'écoute HTTP : cette utilisation de `OrThrow` concerne la configuration au démarrage. Pour charger aussi des fichiers d'environnement, consulter les options de cette fonction dans la documentation conceptuelle.

## Utiliser le route store

Une déclaration achevée par `.handler(...)` construit une route et l'ajoute au store global. Importer les modules qui exécutent ces déclarations, puis enregistrer `routeStore.getAll()` sur le Hub.

L'ordre est essentiel : `.register` consomme les routes présentes à ce moment-là. Le store ne parcourt aucun dossier et n'enregistre pas automatiquement les routes qui seraient déclarées plus tard dans le Hub déjà construit. Un import de type n'exécute pas le module.

Un builder inachevé n'est pas une route enregistrée. Une route marquée `IgnoreByRouteStoreMetadata` est volontairement exclue de cette collecte ; elle peut être enregistrée explicitement si nécessaire.

Le store est global : lorsqu'une application contient plusieurs Hubs qui doivent avoir des ensembles distincts de routes, préférer un enregistrement explicite de ces ensembles plutôt qu'une collecte globale indifférenciée.

## Ajouter un plugin

Brancher le plugin sur le Hub avant d'appeler le connecteur. Les paramètres et les effets relèvent du plugin choisi ; les rechercher depuis `docs/concepts.llms.md`. L'[exemple de génération](examples/generate-sdk.ts) montre `.plug(...)` et un plugin déclenché par le cycle de vie.

Pour approfondir, rechercher l'initialisation HTTP dans le routeur conceptuel du package AgentKit.
