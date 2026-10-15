---
name: duplojs-fundamental
description: "Utiliser les concepts fondamentaux DuploJS dans du code TypeScript : contraintes, composition, Either, validation, temps, modélisation et discrimination."
---

# Fondamentaux DuploJS

La documentation du package `@duplojs/agents-kit` contient les règles et exemples typés de l'écosystème. Depuis le projet consommateur, retrouver son routeur avec :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Lire la rubrique pertinente du routeur, puis uniquement les pages nécessaires. Résoudre les liens relativement au fichier qui les contient, même lorsque ce skill a été installé avec `--copy`.

- `concepts/01-fundamental` : contraintes, currification, Either, structures de données, Chrono, modélisation et discrimination.
- `concepts/05-type-driven-design` : frontières domaine/application/infrastructure, entités, agrégats, repositories et use cases ; les fixtures illustrent leur assemblage.
- `concepts/04-tests` : tests de comportement et de typage, remplacement des implémentations serveur et tests E2E.

Ces chemins sont relatifs au dossier du routeur. Dans le monorepo avant le premier build, les sources sont dans `packages/agents-kit/docs/concepts` et les `index.md` permettent de parcourir les domaines.

Chercher une fonction existante de l'écosystème avant de réimplémenter une opération. Pour les imports entre packages, utiliser le sous-export du domaine et son namespace long, par exemple `import * as DEither from "@duplojs/lang/either";`. Consulter la documentation de currification avant de composer une fonction dans un pipe.
