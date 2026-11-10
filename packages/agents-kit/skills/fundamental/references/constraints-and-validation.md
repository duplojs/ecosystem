# Contraintes et validation

## Établir la garantie

Une contrainte exprime une propriété dans les types : borne, longueur ou format. Les intersections cumulent ces garanties ; leur déclaration seule ne valide ni ne transforme une valeur.

Aux frontières, décrire le contrat complet avec une `DDataStructure` et les contraintes du besoin. Fournir cette structure au module récepteur lorsqu'il propose une intégration ; sinon, valider explicitement et traiter le `Either`. Réutiliser ensuite les garanties établies. Voir [le contrat d'entrée](examples/input-validation.ts).

## Choisir la construction

- **Valeur connue statiquement ou garantie compatible** : `DCommon.cast` calcule les implications statiques que TypeScript ne déduit pas seul. La cible vient du type attendu ; aucune validation runtime n'est effectuée. Voir [les conversions](examples/cast.ts).
- **Littéral à conserver** : `DCommon.infer` conserve aussi le type littéral et exige une entrée littérale. Voir [une propriété littérale](examples/infer.ts).
- **Valeur runtime sans preuve** : validation par une structure, un prédicat ou une fabrique sûre. Une simple `string` ou un simple `number` ne prouve pas de contrainte.
- **Constante spécialisée** : chercher une déclaration sûre du domaine avant `OrThrow`. Vérifier la surcharge : selon l'argument, elle peut retourner une valeur ou un `Either`. Voir [les chemins et Chrono](examples/safe-declarations.ts).

Un refus de `cast` indique une compatibilité non établie : vérifier l'inférence ou le support du calcul pour une contrainte personnalisée, puis choisir une validation si nécessaire. Ne pas fabriquer la preuve avec une assertion ou un helper.

Si un paramètre générique direct ne fournit pas la cible de `cast` ou `infer`, l'expliciter avec `satisfies` après l'appel. Ce contexte ne valide rien et n'est pas nécessaire partout : comparer [le paramètre générique](examples/generic-inference.ts) et [la propriété littérale](examples/infer.ts).

## Exploiter les garanties restantes

Suivre ce que chaque transformation préserve ou perd. Une longueur minimale garantit certains accès ; l'exploiter sans garde redondante. Elle ne garantit pas les indices au-delà du minimum, et n'enlève pas `undefined` du type propre aux éléments. Un filtre peut perdre cette garantie de longueur.

Voir [les accès garantis](examples/guaranteed-array-access.ts) pour distinguer présence prouvée et accès incertain.
