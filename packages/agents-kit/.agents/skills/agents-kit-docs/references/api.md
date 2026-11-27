# Référence API

Cette référence complète les règles communes du [skill de documentation](../SKILL.md) pour les fonctions documentées dans `docs/API/`.

## Définir le périmètre et le routage

Documenter les fonctions exportées par les namespaces publics des packages. Un domaine correspond à un namespace, comme `DArray` pour `@duplojs/lang/array` ; établir son inventaire depuis les exports du chemin d'importation correspondant. Exclure les kinds, les kind handlers, les kind namespaces et les fonctions qu'ils génèrent.

Consacrer un fichier TypeScript à chaque fonction demandée, en regroupant ses surcharges et ses formes d'appel. Tous ces fichiers portent le préfixe `10-`, sous la forme `10-<nom>.ts`, par exemple `10-map.ts` et `10-filter.ts`. Ce préfixe ne s'applique pas aux dossiers de domaine.

Le titre du header est `Namespace.fonction`, par exemple `@title DArray.map`, accompagné d'une courte phrase décrivant son rôle. Exposer uniquement ce header dans le résumé du domaine.

La référence API suit le parcours `docs/API.llms.md` → `docs/API/<package>/<domaine>/index.llms.md` → `10-<fonction>.ts`, éventuellement dans un sous-dossier. Chaque domaine possède un `index.md` présentant le rôle de ses API et un résumé `index.llms.md` rassemblant cette présentation et les headers de ses fonctions, y compris celles rangées dans des sous-dossiers. Un sous-dossier peut posséder un `index.md` pour présenter une section, sans nécessiter son propre résumé. Les index parents présentent les packages et l’ensemble de la référence. Appliquer les règles communes de génération et de vérification à ce parcours ; pour un nouveau domaine, ajouter sa commande de résumé au build avant la génération du sommaire.

## Couvrir les usages et les comportements

Montrer le fonctionnement de la fonction par les appels, sans recopier les signatures publiques ni détailler leurs paramètres, génériques ou surcharges. Montrer les formes classique et curifiée lorsqu'elles existent, avec l'appel curifié directement dans une étape de `DCommon.pipe` lorsque c'est pertinent. Le [skill fondamental](../../../../skills/fundamental/SKILL.md) définit les règles de composition et de formatage du pipe.

Examiner les surcharges et les variantes acceptées par chaque argument, notamment les unions. Couvrir exhaustivement les usages, comportements et garanties de sortie distincts, y compris les combinaisons de variantes qui apportent une différence, selon la règle commune de sélection des exemples.

Illustrer l'exécution avec des usages valides et leurs résultats, y compris les échecs prévus par le contrat, comme un `Left`. Exclure les contre-exemples runtime de mauvaise utilisation. Une construction refusée par le typage peut démontrer une garantie : utiliser alors `// @ts-expect-error` avec une courte explication du refus attendu, afin que la vérification échoue si ce refus disparaît.

Les exemples sont destinés à la lecture et à la validation statique : ne pas utiliser `console.*` pour présenter les résultats. Une variable peut rester le résultat final ; ne pas la consommer artificiellement ni simuler une application complète.

## Montrer les résultats et les contraintes

Vérifier le type de sortie de chaque exemple, qu'il illustre un appel classique, curifié ou une variation, selon les règles communes de `DCommon.ExpectType`.

Lorsque les contraintes des entrées déterminent le type du résultat, montrer cette dépendance dans une variation dédiée : garanties préservées, renforcées ou perdues, ou changement de forme du résultat. Comparer de petits cas si cela rend la différence visible.

Pour mettre en scène une donnée à traiter ayant un type précis, notamment une union ou des contraintes, utiliser `declare const` avec le nom et le type de l'entrée. Les alias nommés conviennent aux types d'entrée réutilisés comme domaine du scénario ; leurs définitions doivent énoncer directement la forme voulue. Ne pas utiliser `as` ni `DCommon.forward<Type>(value)` pour imposer ce contrat ; réserver `DCommon.forward` à sa propre documentation. Pour une valeur concrète, laisser les génériques `const` inférer le littéral depuis l'argument écrit directement dans l'appel, sans `as const` lorsque l'inférence le préserve déjà.

## Documenter les predicates

Lorsqu'une fonction reçoit des predicates, y compris pour les composer ou les combiner, fournir pour chacun un predicate de `@duplojs/lang`, déjà unaire ou configuré par sa forme curifiée. Ne pas réécrire ses tests ni redéclarer manuellement une signature `value is …` : conserver les garanties de l'API.

Pour documenter un predicate lui-même, inclure les deux usages suivants, qu'il propose ou non une forme curifiée :

- **Dans un `if` :** appeler sa forme directe avec la donnée et les éventuels paramètres de configuration dans la condition.
- **Dans un `DCommon.pipe` avec `DCommon.when` :** passer le predicate directement à `DCommon.when`, déjà unaire ou configuré par sa forme curifiée, avec la callback de traitement.

S'il affine le type, choisir une entrée rendant cet affinement visible dans le bloc du `if` et dans la callback de `DCommon.when`. Y vérifier le type affiné et exploiter la garantie acquise avec une opération DuploJS adaptée. La vérification de la sortie globale du pipe reste celle requise pour chaque exemple. Un appel produisant seulement un booléen ou utilisant une autre fonction ne remplace pas ces deux usages.
