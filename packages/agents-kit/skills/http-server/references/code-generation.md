# Générer et consommer les contrats

## Une source de vérité dans les routes

Le plugin `codeGeneratorPlugin`, importé depuis `@duplojs/http/codeGenerator`, produit le contrat TypeScript des routes enregistrées sur le Hub. Les entrées et les réponses déclarées dans les étapes alimentent ce contrat ; maintenir aussi les contrats des échecs prévus.

`outputFile` choisit le fichier de types généré. `generateStructure.outputFolder` active aussi la génération de data structures réutilisables au runtime. Voir [la génération pour un SDK](examples/generate-sdk.ts).

Les types permettent de construire un client déjà informé des méthodes, chemins, paramètres et réponses. Les structures permettent de partager les mêmes schémas de validation avec un consommateur, par exemple dans un SDK utilisé par une autre application.

## Identifier les structures à partager

Donner un identifiant stable aux structures exportables avec `.addIdentifier(...)`, qui retourne une copie nommée. Cette méthode est ajoutée par l'extension `@duplojs/tools/toTypescript` : importer explicitement cette extension dans le module qui appelle la méthode. Les [contrats ordinaires](examples/contracts.ts) restent utilisables sans cette extension ; le [point d'entrée de génération](examples/generate-sdk.ts) crée leurs copies nommées pour le SDK.

L'exemple fournit ces copies avec `generateStructure.structures` et active `generateStructure.disabledFromRoute` pour limiter la génération à cette sélection. Pour une découverte depuis les routes, conserver cette option désactivée et employer les structures identifiées dans les contrats des routes ; le générateur parcourt aussi leurs sous-structures. Ne pas supposer qu'un schéma anonyme produira un export nommé. Vérifier les capacités de génération des structures et contraintes personnalisées dans la documentation des outils.

Réserver le dossier de sortie aux fichiers générés : le plugin remplace ce dossier pendant la génération. Garder les sources écrites à la main ailleurs.

## Déclencher la génération

Importer les modules de routes, enregistrer les routes et brancher le plugin avant de démarrer le cycle avec le connecteur. Le plugin travaille sur le hook `beforeStartServer`, dans les environnements `DEV` et `BUILD` ; créer le Hub et le plugin sans appeler le connecteur ne suffit pas.

Pour un script de génération, utiliser `BUILD`. L'[exemple Node](examples/generate-sdk.ts) appelle `createHttpServer` dans ce mode : le cycle et la génération s'exécutent sans ouvrir l'écoute HTTP. Le Hub doit contenir des routes pour que le plugin produise les fichiers attendus.

Les routes de cet exemple déclarent certaines capacités avec `declare function` : elles démontrent leurs contrats sans fournir d'implémentation applicative. La génération n'exécute pas leurs handlers. Pour servir ces routes, raccorder les capacités réelles ; pour démarrer un exemple autonome, utiliser [l'initialisation minimale](examples/initialize.ts).

## Distribuer et utiliser le résultat

Publier les types et structures générés dans le package consommateur ou le SDK selon son organisation. Importer le type généré `Routes` pour paramétrer `createHttpClient` depuis `@duplojs/http/client`, et importer les structures générées lorsque le consommateur doit valider des données. Garder ces ressources issues de la génération, sans recopier à la main les contrats du serveur.

Pour le raccordement concret du client, ses sélecteurs et les API sans contrats générés, utiliser le skill `duplojs-http-client` ou rechercher le client HTTP dans `docs/concepts.llms.md` du package installé. Pour les options de génération, rechercher le partage des contrats HTTP et les outils de transformation des data structures dans `docs/concepts.llms.md`.
