# Composition

## Configurer dans le contexte du pipe

La forme directe reçoit donnée et paramètres ; la forme curifiée configure les paramètres puis reçoit la donnée. Une fonction déjà unaire peut être passée directement.

Si la fonction retournée ne déclare pas ses propres génériques, ses types sont fixés à la configuration. Écrire cet appel dans l'étape du pipe apporte le contexte d'inférence ; passer ensuite une variable déjà configurée à un pipe ne le rétablit pas. Ne pas forcer cette préparation par génériques, annotations ou casts.

Pour réutiliser le traitement, écrire une fonction recevant la donnée et construisant son pipe, ou utiliser la forme directe. L'[exemple de composition](examples/composition.ts) montre les deux formes, le format multiligne et une préparation à éviter.

Préparer les données de sources indépendantes avant de les combiner ; les configurations curifiées restent dans leur pipe. Voir [deux sources indépendantes](examples/independent-inputs.ts).

## Asynchronisme et résultats

`DCommon.asyncPipe` attend chaque étape ; un seul `await` final suffit. Voir l'[exemple asynchrone](examples/async-composition.ts).

`DEither.rightPipe` et `rightAsyncPipe` transmettent les valeurs des `Right` et arrêtent au premier `Left`. Un pipe ordinaire ne s'arrête pas automatiquement sur un `Left`. Pour sélectionner un état produit par une étape, composer production et sélection dans un `innerPipe` ou `asyncInnerPipe`, avant de rendre le résultat au pipe extérieur. Une callback construisant un `pipe` ou `asyncPipe` convient aussi.

Ce montage s'applique à toute étape ou callback imbriquée. À l'étape extérieure suivante, le `Right` serait déjà déballé, sans son information. Voir la [sélection intermédiaire](examples/result-selection.ts).
