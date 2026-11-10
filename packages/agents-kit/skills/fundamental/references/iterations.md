# Itérations

## Parcourir une collection

Configurer `DArray.reduce(initial, callback)` dans l'étape d'un `DCommon.pipe` recevant le tableau. La callback reçoit `element`, `index` et `lastValue`, initialement égal à l'accumulateur de départ :

- `next(nouvelÉtat)` poursuit ; `next(lastValue)` ignore l'élément.
- `exit(résultat)` arrête immédiatement et peut changer le type de sortie.

Sans `exit`, le résultat est le dernier accumulateur ; une source vide retourne l'initial. Pour un état structuré, utiliser `DArray.reduceFrom<Type>(valeur)` et construire les nouveaux états sans mutation.

Pour un autre itérable, utiliser `DGenerator.reduce`. `DGenerator.asyncReduce` accepte tableaux, itérables synchrones ou asynchrones et attend chaque étape. Leurs callbacks reçoivent `item` ; initialiser leurs états structurés avec `DGenerator.reduceFrom`.

## Répéter jusqu'à une condition

`DCommon.loop` fournit `count` depuis zéro et `previousOutput`, initialement `undefined`, puis égal au dernier `next`. Initialiser l'état au premier appel ; `exit` donne le résultat final. Les génériques décrivent sortie puis état intermédiaire. `DCommon.asyncLoop` attend les étapes asynchrones.

Conserver la condition avant le traitement d'un `while`, après celui d'un `do...while`. Pour une répétition par compteur, utiliser aussi `loop`, sans fabriquer un tableau.

Voir les [exemples typés](examples/iterations.ts), avec accumulateurs, sorties anticipées et variantes asynchrones.
