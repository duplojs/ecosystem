# Importations

## Imports entre packages

Lorsqu'un package importe un autre package de l'écosystème DuploJS, l'import doit cibler directement le sous-export utilisé et être exposé sous forme de namespace.

```ts
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import * as DServerCommon from "@duplojs/server/common";
```

Il ne faut pas importer les namespaces depuis l'index principal du package :

```ts
// À éviter
import { DEither, DCommon } from "@duplojs/lang";
```

Les index peuvent exposer ces namespaces pour les consommateurs :

```ts
export * as O from "./object";
export * as DObject from "./object";

export * as S from "./string";
export * as DString from "./string";
```

Cependant, importer directement le sous-export permet de limiter l'import au domaine utilisé et de préserver le tree-shaking.

Le nom du namespace doit correspondre au nom long exposé par le package.

```ts
// Correct
import * as DObject from "@duplojs/lang/object";

// À éviter
import * as O from "@duplojs/lang/object";
```

## Imports dans les tests

Les tests situés dans `tests/` d'un package peuvent importer directement les namespaces exposés par `@scripts`.

```ts
import { DCommon, DPath } from "@scripts";
```

Là encore, seuls les noms longs doivent être utilisés.

Cette exception concerne les tests directs du package. Les tests d'intégration utilisent les mêmes règles d'import que du code consommant les packages de l'écosystème.
