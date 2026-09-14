# Tests unitaires

Ce fichier complète les conventions générales du skill `unit-tests` pour le package `@duplojs/lang`.

## Imports des domaines

`lang` étant le package qui définit les domaines fondamentaux de l'écosystème, ses tests unitaires ne doivent pas importer ses propres domaines depuis `@duplojs/lang`.

Les domaines utilisés par les tests doivent être importés directement depuis les sources du package avec `@scripts/<domain>`.

```ts
import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import * as DArray from "@scripts/array";
```

Cette règle s'applique aussi bien au domaine actuellement testé qu'aux autres domaines de `lang` nécessaires à son test.

Par conséquent, dans les tests de `lang` :

```ts
// Correct
import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
```

```ts
// Interdit
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
```

Cette convention surcharge, pour le package `lang`, la convention générale qui demande d'importer `DCommon` ou `DEither` depuis `@duplojs/lang`.

Les tests unitaires doivent tester directement les sources courantes de `lang`, et non le package généré ou sa propre API publiée.
