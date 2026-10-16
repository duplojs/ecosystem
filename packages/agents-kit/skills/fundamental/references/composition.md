# Composer une opération

## Forme directe et forme curifiée

La forme directe reçoit la donnée et les paramètres. La forme curifiée reçoit les paramètres, puis retourne la fonction qui recevra la donnée. Son usage principal est la composition avec `pipe`.

Comparer les formes directe et curifiée dans [cet exemple de transformation](examples/composition.ts).

Le pipe suit ici une même donnée : utilisateurs, utilisateurs actifs, noms. Passer directement une fonction unaire si sa signature convient ; utiliser la forme curifiée quand il faut fixer des paramètres. Ne pas supposer que toutes les fonctions exposent les mêmes surcharges.

## Plusieurs sources indépendantes

Quand plusieurs arguments demandent chacun leur propre préparation, les nommer avant l'appel. Les paramètres fixes, comme le prédicat d'un filtre, restent naturellement à l'étape concernée.

Voir [la préparation de deux arguments indépendants](examples/independent-inputs.ts).

Le résultat de cet appel peut ensuite devenir l'entrée d'un autre pipe si plusieurs transformations se suivent.

## Asynchronisme et résultats

`DCommon.asyncPipe` attend chaque étape avant la suivante. Un seul `await` sur le pipe suffit pour obtenir le résultat final.

Voir [un enchaînement asynchrone](examples/async-composition.ts).

Si chaque étape peut renvoyer un `Either`, utiliser `DEither.rightPipe` ou `DEither.rightAsyncPipe` pour propager automatiquement le premier `Left`. Un pipe ordinaire ne décide pas à lui seul comment traiter un `Left`. Les pipes de `DEither` transmettent la valeur du `Right` à l'étape suivante, et non son wrapper.

Pour approfondir, rechercher la currification et la composition des `Either` dans `docs/concepts.llms.md`, depuis la racine AgentKit indiquée dans les instructions du projet.
