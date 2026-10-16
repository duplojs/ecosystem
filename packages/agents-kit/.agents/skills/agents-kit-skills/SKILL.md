---
name: agents-kit-skills
description: "Créer ou modifier les skills installables d'AgentKit destinés aux consommateurs de DuploJS : cohérence avec les concepts, références, exemples TypeScript vérifiés et intégration à l'installation."
---

# Rédiger les skills distribués par AgentKit

Ce skill guide le travail interne sur les skills destinés aux projets consommateurs de DuploJS. **Charger et lire systématiquement le skill OpenAI `skill-creator` en complément**, avant toute rédaction ou modification. Il définit les principes généraux de conception ; le présent skill précise leur application à AgentKit.

Les chemins ci-dessous sont relatifs à la [racine du package](../../..). Les skills distribués sont dans `skills/`. Le présent skill reste dans `.agents/skills/`, avec les outils de contribution au package ; il n'appartient pas à l'enum des skills installables.

## Partir des concepts

Avant de rédiger une consigne, identifier les concepts sur lesquels elle repose et lire leurs explications et exemples. Commencer par le [routeur conceptuel](../../../docs/concepts.llms.md). Avant sa génération, parcourir les `index.md` des [sources des concepts](../../../docs/concepts). Pour une révision, lire aussi le skill entier et les références concernées afin de comprendre sa démarche et la répartition des consignes avant de choisir où intervenir.

Les concepts expliquent les principes et les contrats ; les skills transforment ces connaissances en décisions et en démarches applicables à une tâche. Conserver la terminologie, les responsabilités et les garanties exprimées dans les concepts. Un skill ne doit pas introduire une règle ou un exemple qui les contredit.

Vérifier les exports publics et les signatures utiles ; consulter les implémentations et les tests si un comportement ou une garantie reste incertain. En cas de divergence entre les concepts et l'API, établir la cause et résoudre la divergence dans la ressource concernée, ou signaler ce qui reste incohérent. Ne pas masquer le problème en inventant une convention propre au skill.

Si les concepts doivent être créés ou corrigés, appliquer aussi le [skill de documentation AgentKit](../agents-kit-docs/SKILL.md) et régénérer les routeurs concernés.

## Écrire pour la consommation de l'écosystème

Le destinataire est un agent qui développe une application avec DuploJS, y compris un modèle ayant besoin d'instructions concrètes. Expliquer comment choisir et assembler les API publiques pour réaliser la tâche. Les conventions de contribution au monorepo et l'implémentation interne des librairies restent dans les ressources internes du projet.

- Définir un déclenchement lié au besoin réel de l'utilisateur. Utiliser un package comme périmètre lorsqu'il correspond à une tâche cohérente, sans imposer un skill par package.
- Garder dans `SKILL.md` les règles essentielles, les choix courants et les liens qui orientent vers les détails. Mettre les variantes, difficultés récurrentes et explications conditionnelles dans `references/`.
- Donner une démarche courte qui indique comment obtenir le résultat attendu. Lors d'une modification, réexaminer l'étape responsable et y intégrer le besoin en fusionnant, remplaçant ou déplaçant les consignes concernées. Éviter l'accumulation d'exceptions et de rappels ; conserver les préconditions et les conséquences utiles des choix.
- Formuler les règles indépendamment d'une liste de protocoles, plateformes ou modules. Présenter les cas concrets comme des exemples, sans limiter la portée du principe à ces cas.
- Éviter de recopier les concepts, de multiplier les rappels des fondamentaux ou d'énumérer toutes les API. Référencer les ressources qui portent déjà cette connaissance.

## Introduction commune aux skills installables

Commencer chaque `SKILL.md` distribué, juste après son titre principal, par une section `Trouver les concepts`. Reproduire le paragraphe suivant à l'identique dans tous les skills installables ; lors d'une modification de ce texte commun, la reporter dans chacun d'eux :

> Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Faire suivre ce paragraphe de la même solution de repli :

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Placer les orientations propres au domaine dans les sections suivantes. Les consignes propres au monorepo, notamment la consultation des sources avant le premier build, restent dans les ressources internes de contribution.

## Conserver les exemples dans des fichiers TypeScript

**Tout exemple de code TypeScript doit être dans un fichier `.ts` vérifié par le typage**, lié depuis le Markdown qui explique quand le consulter. Ne pas conserver de blocs TypeScript dans `SKILL.md` ou ses références et ne pas recopier le même exemple dans le texte.

Placer les exemples propres au skill sous `skills/<nom>/references/examples/`. Garder les dépendances locales de ces exemples dans le même dossier de skill pour qu'une installation par copie reste complète. Les concepts existants se consultent dans le package installé ; ne pas utiliser un lien relatif qui supposerait que le skill copié est encore voisin de `docs/`.

Avant de modifier un exemple, lire les [règles d'importation](../../../../../.agents/importations.md). Utiliser les exports publics des packages, sans alias interne au monorepo ni import de sources privées. Vérifier que les dépendances utilisées sont déclarées par AgentKit.

Choisir de petits exemples qui démontrent une décision ou une garantie précise. Ajouter des commentaires sur ce que le code ne dit pas à lui seul. Pour les garanties importantes, utiliser `DCommon.ExpectType` et, pour une construction volontairement refusée, un `@ts-expect-error` expliqué. Ces vérifications doivent échouer si la garantie illustrée disparaît ; ne pas contourner le typage pour maintenir l'exemple.

Le [tsconfig documentaire](../../../tsconfig.doc.json) inclut `skills/**/*.ts`. Vérifier que chaque nouvel exemple y entre effectivement et qu'il est aussi couvert par le lint. Pour un comportement que la compilation seule ne garantit pas, comme un chargement d'extension ou une génération de fichiers, vérifier l'exécution pertinente dans un environnement temporaire adapté.

## Intégrer un skill installable

Créer le dossier sous `skills/<nom>/` et choisir un `name` cohérent avec son nom installé `duplojs-<nom>`. Ajouter la clé `<nom>` à **`SkillEnum` dans [scripts/bin/install/skill.ts](../../../scripts/bin/install/skill.ts)** lors de l'ajout d'un nouveau skill. Lors d'une modification, vérifier que cette entrée existe déjà.

Les tests de l'installateur couvrent ses comportements avec un ou deux skills représentatifs : sélection, installation complète, copie, liens, destinations, remplacement et erreurs. Ne pas ajouter de cas pour chaque nouveau skill lorsque le mécanisme d'installation reste identique. Ajouter un test seulement si un nouveau comportement ou un cas d'usage spécifique le justifie.

Conserver un contrôle global entre `SkillEnum` et les dossiers distribués, et un inventaire automatique pour l'installation complète dans les [tests d'installation](../../../integrations/install.test.ts). Vérifier ainsi que les références et exemples sont distribués ensemble, en copie comme en lien symbolique, sans maintenir une nouvelle liste de scénarios par skill. Le champ `files` du package doit continuer à inclure les ressources nécessaires.

## Vérifier le résultat

- Valider les métadonnées et la structure selon `skill-creator`, ainsi que les liens vers les références, les exemples et les concepts.
- Relire le skill entier et ses références modifiées face aux concepts utilisés : démarche cohérente, absence de contradiction ou de répétition, portée correcte et volume de consignes proportionné au besoin. Vérifier que le remaniement reste limité aux parties concernées, que les exemples sont identifiés comme tels et que les détails se chargent à la demande.
- Construire le package avec `pnpm --filter @duplojs/agents-kit build`, puis vérifier le typage avec `pnpm --filter @duplojs/agents-kit test:types` et le lint avec `pnpm --filter @duplojs/agents-kit test:lint`.
- Lorsque l'ensemble installable ou ses ressources change, exécuter les tests d'installation après le typage et le lint pour vérifier la distribution complète du skill.
- Vérifier que le contenu destiné aux consommateurs ne suppose ni l'arborescence ni les alias du monorepo, et qu'il retrouve la documentation après une installation par copie.
