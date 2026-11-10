# Itérations

## Parcourir une collection

Configurer `DArray.reduce(initial, callback)` dans l'étape d'un `DCommon.pipe` recevant le tableau. La callback reçoit `element`, `index` et `lastValue`, initialement égal à l'accumulateur de départ :

- `next(nouvelÉtat)` poursuit ; `next(lastValue)` ignore l'élément.
- `exit(résultat)` arrête immédiatement et peut changer le type de sortie.

Sans `exit`, le résultat est le dernier accumulateur ; une source vide retourne l'initial. Pour un état structuré, utiliser `DArray.reduceFrom<Type>(valeur)` et construire les nouveaux états sans mutation.

Pour un autre itérable, utiliser `DGenerator.reduce`. `DGenerator.asyncReduce` accepte tableaux, itérables synchrones ou asynchrones et attend chaque étape. Leurs callbacks reçoivent `item` ; initialiser leurs états structurés avec `DGenerator.reduceFrom`.

## Répéter jusqu'à une condition

`DCommon.loop` fournit `count` depuis zéro. `next()` continue et `exit(valeur)` retourne le résultat final. La donnée optionnelle de `next` n'est pas transmise au tour suivant ; utiliser `DCommon.loopAccumulator(initial, callback)` lorsque les tours doivent partager un état. Sa callback reçoit `accumulator`, `count`, `next(nouvelAccumulateur)` et `exit(résultat)`. `DCommon.asyncLoop` et `DCommon.asyncLoopAccumulator` offrent les mêmes comportements en attendant la callback asynchrone.

`DGenerator.loop(callback)` produit une séquence : chaque `next(...valeurs)` émet les valeurs définies et poursuit la boucle ; `exit(...valeurs)` émet sa dernière séquence puis termine. La callback reçoit `count`, pas la valeur du tour précédent. `DGenerator.asyncLoop` attend les callbacks et résout les valeurs promises avant de les émettre.

Les variantes `DGenerator.loopAccumulator(initial, callback)` et `DGenerator.asyncLoopAccumulator(initial, callback)` font circuler un accumulateur avec `next(nouvelAccumulateur, ...valeursÀÉmettre)`. `exit(...valeursÀÉmettre)` termine en émettant les dernières valeurs. Utiliser `DGenerator.loopAccumulatorFrom<Type>(valeur)` pour préserver un type d'accumulateur structuré ou une union.

Conserver la condition avant le traitement d'un `while`, après celui d'un `do...while`. Pour une répétition par compteur, utiliser aussi `loop`, sans fabriquer un tableau.

Voir les [exemples typés](examples/iterations.ts), avec accumulateurs, sorties anticipées et variantes asynchrones.
