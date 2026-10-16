---
name: duplojs-http-client
description: "Consommer une API HTTP DuploJS ou externe avec le client typé : contrats des requêtes et réponses, PromiseRequest, attentes et sélecteurs Either, mode Predicted, hooks, SSE et streams."
---

# Client HTTP DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Consommer une API avec le client HTTP

Utiliser le client de `@duplojs/http/client` pour les appels HTTP vers une API DuploJS ou externe. Fournir à `createHttpClient<Routes>` un contrat précis des entrées et réponses : il peut provenir du générateur, être écrit à la main ou être composé avec d'autres types compatibles. Le client fonctionne indépendamment du serveur DuploJS ; conserver le typage des méthodes, chemins, paramètres et réponses quel que soit le fournisseur de l'API.

Configurer les valeurs par défaut et les hooks transversaux sur le client. Chaque appel produit une `PromiseRequest` : y attacher les hooks locaux avec `when*`, puis exprimer le résultat voulu avec `iWant*` ou un sélecteur avant `await`. Les attentes retournent un `Either` ; les variantes `OrThrow` lèvent une erreur si elles ne sont pas satisfaites. Privilégier `information` pour un cas précis lorsque l'API en fournit une, sinon sélectionner par code.

Le mode de réponses prévues est actif par défaut : une réponse sans le header `predicted` ne satisfait pas une attente, même si son code ou son information correspond. Pour une API qui ne fournit pas ce marqueur, configurer **`disabledPredictedMode: true`** sur son client. Ce marqueur distingue une réponse contractuelle d'une réponse imprévue ; il ne valide pas le body.

Lire [Client typé, attentes et flux](references/client.md) pour choisir les sélecteurs, distinguer les réponses prévues des résultats voulus, raccorder une API externe et consommer du SSE ou un stream.
