# Entrées et garanties

Lire l'[exemple de prévisualisation](examples/preview-command.ts) pour combiner arguments, option obligatoire, option numérique facultative, flag et liste bornée. Les assertions `DCommon.ExpectType` y vérifient les garanties reçues dans le callback.

## Valeurs du terminal

`createArgument` reçoit le nom, la data structure et les paramètres éventuels. L'ordre dans `subjects` fixe l'ordre des valeurs positionnelles. Une déclaration facultative ajoute `undefined` à la valeur reçue ; la data structure décrit la valeur présente.

`createOption` reçoit également un nom et une data structure. La syntaxe accepte `--format=json` et `--format json`, ainsi qu'un alias déclaré comme `-f json`. Déclarer les noms et les alias sans tirets. Le décodage depuis les chaînes est intégré, y compris vers un nombre : une data structure numérique peut donc valider un entier et ses bornes avant le callback.

Ne pas confondre une option facultative avec une valeur par défaut : appliquer la valeur de repli au résultat validé, ou rendre l'option obligatoire selon le contrat attendu.

## Flags et listes

`createBooleanOption` modélise la présence : `--overwrite` active le flag. `--overwrite=false` est invalide ; ne pas le proposer comme syntaxe de désactivation.

`createArrayOption` reçoit le schéma d'un **élément**, puis décode les éléments d'une valeur séparée par des virgules par défaut : `--include=src,tests`. Utiliser `separator` pour changer ce séparateur. Ne pas supposer qu'une répétition du flag accumule les valeurs.

`min` et `max` contraignent la longueur d'une liste présente. Ils ne rendent pas l'option obligatoire : ajouter `required: true` si son absence doit échouer. Avec un `min` littéral de `1`, une liste obligatoire garantit un premier élément ; exploiter cette garantie sans assertion ni garde d'absence redondante.

Exemple d'appel de la sous-commande exposée par [cli.ts](examples/cli.ts) :

```sh
my-cli preview ./src ./out --format=json --limit=20 --include=src,tests --overwrite
```

L'exemple affiche les paramètres d'une prévisualisation ; il n'écrit aucun fichier. L'argument `destination` et l'option `limit` peuvent être omis, tandis que `source`, `format` et `include` sont requis.
