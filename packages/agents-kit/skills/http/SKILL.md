---
name: duplojs-http
description: Créer ou modifier une application, des routes ou un client HTTP avec les packages DuploJS, leurs validations et leurs contrats typés.
---

# HTTP DuploJS

Depuis le projet consommateur, retrouver le routeur documentaire du package installé :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Les chemins suivants sont relatifs au dossier du routeur :

- `concepts/02-server/20-http` : initialisation de l'application, routes, routines de vérification, JWT et partage des contrats par génération de code.
- `concepts/03-client/10-http` : initialisation du client, requêtes et hooks.
- `concepts/01-fundamental/04-data-structure` : contrats, validation des entrées, codecs et erreurs.
- `concepts/05-type-driven-design/04-infrastructure` : assemblage des routes et use cases avec les ports d'infrastructure.

Lire les pages pertinentes depuis le routeur et résoudre chaque lien relativement au document qui le contient. Le mode `--copy` copie ce skill ; les documents se consultent dans le package installé. Dans le monorepo avant le premier build, parcourir les `index.md` de `packages/agents-kit/docs/concepts`.

Vérifier les contrats d'entrée et les résultats documentés avant de composer une route ou une requête. Utiliser les sous-exports publics et leurs namespaces longs, comme dans les exemples, et les fonctions de l'écosystème lorsqu'elles couvrent l'opération nécessaire.
