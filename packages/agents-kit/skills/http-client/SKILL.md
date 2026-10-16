---
name: duplojs-http-client
description: "Appeler une API HTTP DuploJS ou externe avec le client typé de @duplojs/http/client : configurer son contrat, sélectionner les réponses, traiter les erreurs et consommer les flux."
---

# Client HTTP DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Retrouver le contrat et configurer le client

Importer `@duplojs/http/client` sous le namespace `DHttpClient`. `createHttpClient<Routes>` reçoit le contrat des méthodes, chemins, entrées et réponses de l'API. Ce contrat peut être généré, écrit à la main ou composé ; le client fonctionne aussi avec un serveur externe à DuploJS.

Retrouver les routes consommées et le client existant avant d'en créer un. Pour créer le client ou modifier son contrat et sa configuration, lire [Contrat et configuration](references/configuration.md). L'[exemple d'API externe](references/examples/external-client.ts) montre un contrat écrit à la main et la sélection par code.

Le mode Predicted est actif par défaut : les attentes refusent une réponse sans header `predicted`, même si son code ou son information correspond. Pour un fournisseur sans ce marqueur, configurer **`disabledPredictedMode: true`**. Le contrat TypeScript et ce marqueur ne valident pas le body au runtime ; utiliser une data structure lorsque le traitement exige cette garantie.

## Sélectionner la réponse et traiter le résultat

Chaque appel produit une `PromiseRequest`, sur laquelle les réactions locales s'enregistrent avant la sélection. Une réponse **prévue** appartient au contrat de l'API ; la réponse **voulue** est celle que le traitement accepte à cet endroit. Un refus métier prévu peut donc être rejeté ici.

1. Fournir les paramètres typés de l'appel et attacher les hooks ou intercepteurs locaux nécessaires.
2. Sélectionner le cas voulu avec `iWantInformation`, ou `iWantCode` si l'API ne fournit pas d'information. Pour répartir explicitement toutes les variantes du contrat, utiliser un sélecteur exhaustif.
3. Attendre le résultat sélectionné. Les attentes sûres renvoient un `Either` ; elles ne renvoient plus une `PromiseRequest` à configurer.
4. Discriminer le résultat, puis utiliser la réponse voulue ou traiter et propager les autres branches. Une réponse rejetée porte `unexpect-response` ; une erreur de requête porte `request-error`.

Pour écrire ou modifier une sélection, lire [Choisir et traiter les réponses](references/responses.md). L'[exemple de sélecteurs](references/examples/client-expectations.ts) distingue les résultats par information ou par code. Dans une fonction réutilisable qui transforme le résultat, conserver toutes les branches sous `Either`, y compris la nouvelle valeur de réussite.

## Ajouter les comportements nécessaires

| Condition rencontrée | Ressource à lire |
| --- | --- |
| Un comportement commun ou une réaction locale doit observer ou transformer l'échange | [Hooks et intercepteurs](references/hooks.md), avant de placer la réaction dans le cycle. |
| La réponse contient des SSE ou des données à recevoir progressivement | [Consommation d'un flux](references/streams.md) et l'[exemple SSE et stream](references/examples/client-streams.ts), avant de lancer la lecture. |

Enregistrer les callbacks d'un flux ne démarre pas sa consommation. Après sélection de la réponse, parcourir son itérateur asynchrone ou appeler la méthode de consommation adaptée ; prévoir sa fermeture selon le cycle attendu.

## Vérifier l'intégration

Exécuter le typage et les vérifications du projet. Vérifier la réponse voulue et les branches de refus ou d'erreur concernées par la modification, y compris l'absence de traitement dépendant après un échec. Contrôler les headers réels du fournisseur pour le mode Predicted et valider le body lorsque le contrat exige une garantie runtime. Pour un flux, vérifier aussi le démarrage de la consommation et sa fermeture.
