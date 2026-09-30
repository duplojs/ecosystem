## Manipuler le temps avec `chrono`

`chrono` regroupe les outils utilisés pour représenter et manipuler les dates et les durées.

Deux types principaux sont utilisés :

- `TheDate` représente un instant précis ;
- `TheTime` représente une durée ou une quantité de temps.

Il faut privilégier ces types aux `Date` et `number` natifs afin de conserver une représentation explicite et contrôlée du temps dans le domaine.

`chrono` fournit notamment les outils pour :

- créer des dates et des temps de manière sûre ;
- manipuler, comparer et calculer des dates ou des durées ;
- sérialiser ces valeurs dans un format identifiable et transportable ;
- gérer l'interprétation et l'affichage selon les fuseaux horaires.

Une `TheDate` représente toujours un instant absolu. Les fuseaux horaires ne doivent intervenir que lorsqu'une date locale doit être interprétée ou lorsqu'un instant doit être présenté dans un contexte local.