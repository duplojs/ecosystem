# Résultats typés et exceptions

## Une fonction réutilisable rend l'échec visible

Renvoyer un `DEither.Right` en cas de réussite et un `DEither.Left` en cas d'échec. L'information identifie le cas ; la valeur associée transporte les détails utiles. Le contrat de retour exprime les issues possibles et permet à l'appelant de décider.

Voir [une fonction qui propage les échecs de lecture](examples/error-propagation.ts).

Le `Left` de lecture reste visible dans le type de retour. Une autre fonction peut le propager, le convertir en un échec métier ou tenter une récupération. Elle ne doit pas déballer un résultat incertain ou remplacer la propagation par un `throw` caché.

`DEither.rightPipe` et `DEither.rightAsyncPipe` composent les étapes sur les valeurs de réussite et arrêtent au premier `Left`. `DEither.isRight` et `DEither.isLeft` permettent une discrimination explicite avant `unwrapRight` ou `unwrapLeft`.

Pour intégrer une API tierce qui lève des exceptions, utiliser au besoin `DEither.safeCallback` ou `DEither.asyncSafeCallback` afin de convertir l'échec en résultat. Préférer d'abord l'API DuploJS sûre si elle existe.

## Le point d'entrée décide de l'effet final

Le « top level » est la frontière d'exécution responsable de décider de l'effet final d'un traitement. Son rôle dépend du contrat d'exécution, quel que soit le mécanisme qui déclenche le traitement. Ce n'est ni le nombre d'indentations ni le fait de déclarer une fonction au niveau d'un module.

Exemples : initialisation du programme, callback d'une commande ou handler d'une route.

```text
entrée externe
  → validation par les schémas du module
  → point d'entrée du traitement
    → fonction applicative
      → sous-fonction : renvoie Right ou Left
    ← résultat typé
  ← résultat typé
  → le point d'entrée décide de l'effet final
```

Les fonctions applicatives et leurs sous-fonctions renvoient leurs échecs dans leur contrat de retour. Être appelées depuis un point d'entrée ne leur transfère pas la responsabilité de l'effet final.

À cette frontière, interpréter le `Left` selon le contrat d'exécution : par exemple produire une réponse HTTP, un diagnostic de commande ou une exception adaptée. Le fait qu'un appelant ignore le retour d'une fonction ne suffit pas à autoriser cette fonction à lever une exception.

## Choisir entre version sûre et `OrThrow`

Appliquer la préférence dans cet ordre : déclaration sûre d'une valeur connue ; fabrique ou validation renvoyant un `Either` ; variante `OrThrow` uniquement dans une exception identifiée.

| Situation | Choix |
| --- | --- |
| Constante dont la validité est prouvable | `cast`, `infer`, helper de déclaration ou surcharge littérale sûre |
| Valeur runtime sans preuve suffisante | Validation ou fabrique sûre, puis traitement du `Either` |
| Donnée externe, quelle que soit sa provenance | Validation par un data parser ; jamais `OrThrow` pour lui attribuer une contrainte |
| Fonction réutilisable ou traitement imbriqué d'une entrée | Renvoyer, propager ou adapter le `Left` |
| Préparation de valeurs dans un test unitaire | `OrThrow` permis si une déclaration sûre ne convient pas |
| Configuration de l'environnement au démarrage | `OrThrow` permis pour interrompre immédiatement une initialisation invalide |
| Opération d'environnement sans donnée externe fournie, échec très rare | `OrThrow` envisageable si propager cet échec compliquerait fortement le code |

En tests, une déclaration sûre reste prioritaire : voir [les déclarations sûres](examples/safe-declarations.ts). L'autorisation de préparer une fixture avec `OrThrow` ne change pas le contrat du code testé ; tester les échecs attendus à travers les versions sûres.

## Environnement : exceptions ciblées

Une configuration invalide peut empêcher le démarrage. Valider l'environnement une fois lors de l'initialisation, puis transmettre la configuration typée aux fonctions réutilisables.

Voir [la validation de l’environnement au démarrage](examples/environment-initialization.ts).

Cette exception concerne la configuration de l'environnement au démarrage. Elle ne s'étend pas aux données reçues pendant le fonctionnement du logiciel.

`DSCommon.getCurrentWorkDirectoryOrThrow()` illustre l'autre exception : aucun argument externe ne déclenche son échec ; un répertoire courant supprimé est un incident d'environnement rare. Son usage peut être justifié si propager ce cas ajouterait une forte complexité. Préférer `DSCommon.getCurrentWorkDirectory()` si cette propagation s'intègre naturellement ou si le contexte rend l'incident plausible.

Une donnée fournie de l'extérieur ne relève pas de cette exception : l'entrée peut normalement être invalide. Utiliser la structure ou la fabrique sûre du domaine concerné, puis traiter le résultat. Par exemple, `DPath.create` pour un chemin dynamique ou une fabrique Chrono sûre pour une date.

Pour approfondir, rechercher les `Either`, l'environnement ou le contexte d'exécution concerné dans `docs/concepts.llms.md`, depuis la racine AgentKit indiquée par les instructions du projet.
