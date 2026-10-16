---
name: agents-kit-skills
description: "Créer ou modifier les skills installables d'AgentKit pour les consommateurs de DuploJS, adaptés aussi aux modèles moins performants : concepts pratiques, lectures ciblées, exemples vérifiés et intégration à l'installation."
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

Le destinataire est un agent qui développe une application avec DuploJS, notamment un modèle moins performant. Lui donner les concepts pratiques et les critères nécessaires pour choisir et assembler les API publiques dès le chargement du skill. Expliciter les particularités de DuploJS qui changent ses décisions, sans réenseigner la programmation générale. Les conventions de contribution au monorepo et l'implémentation interne des librairies restent dans les ressources internes du projet.

- Définir un déclenchement lié au besoin réel de l'utilisateur. Utiliser un package comme périmètre lorsqu'il correspond à une tâche cohérente, sans imposer un skill par package.
- Garder dans `SKILL.md` les distinctions conceptuelles indispensables, les invariants, les choix courants et la démarche. Définir les termes nécessaires avant de demander un choix entre plusieurs mécanismes. Présenter le chemin courant avant les variantes, difficultés d'API et configurations avancées, consultables dans `references/`.
- Donner une démarche courte avec les entrées à examiner, les conditions des choix et le résultat attendu. Délimiter la portée des obligations ; distinguer un invariant d'une préférence ou d'une procédure conditionnelle. Lors d'une modification, intégrer le besoin dans l'étape responsable en fusionnant, remplaçant ou déplaçant les consignes concernées, plutôt qu'accumuler des exceptions et des rappels.
- Formuler les règles indépendamment d'une liste de protocoles, plateformes ou modules. Présenter les cas concrets comme des exemples, sans limiter la portée du principe à ces cas.
- Garder l'explication complète dans la ressource conceptuelle responsable. Un résumé dans le skill se justifie s'il permet une décision immédiate ; il doit rester cohérent avec cette ressource. Dans les skills spécialisés, rappeler les conséquences locales d'une règle plutôt que répéter toute sa doctrine. Éviter les catalogues d'API.

## Déclencher les lectures selon la tâche

Associer chaque lecture nécessaire à une condition observable dans la tâche ou le contrat, et indiquer ce qu'elle doit permettre de décider. Un modèle moins performant peut ignorer qu'une connaissance lui manque : « lire si tu as un doute » ne suffit pas pour une garantie importante. Par exemple, lorsqu'un contrat exige une `Evidence`, orienter vers son concept et l'opération qui établit la preuve attendue.

Lier directement depuis `SKILL.md` les ressources nécessaires aux décisions principales : référence de procédure, concept ou exemple TypeScript. Garder les parcours courts ; éviter de faire traverser plusieurs index pour atteindre une connaissance déjà identifiée. Le routeur sert à rechercher les concepts et mécanismes qui ne sont pas déjà orientés par le skill. L'introduction commune ci-dessous n'impose pas de le relire à chaque tâche ni de charger toute la documentation.

Borner l'exploration du projet aux contrats concernés et aux opérations qui établissent leurs garanties. Dans une démarche de modélisation, partir du contrat actuel et lire les faits appelés par l'agrégat concerné pour comprendre les transitions et leur intention. Étendre la lecture lorsqu'une précondition, une provenance, un effet ou une responsabilité nécessaire reste inexpliqué ; arrêter lorsque ces informations permettent de réaliser et vérifier la modification.

Ces choix sont des recommandations de conception à vérifier avec les modèles cibles. Pour réexaminer leurs fondements ou préparer une évaluation, consulter [les sources, leurs limites et le protocole de comparaison](references/skill-design-research.md). La recherche ne fixe pas de longueur idéale ni un nombre universel de skills à charger.

## Introduction commune aux skills installables

Commencer chaque `SKILL.md` distribué, juste après son titre principal, par une section `Trouver les concepts`. Reproduire les deux paragraphes suivants à l'identique dans tous les skills installables ; lors d'une modification de ce texte commun, la reporter dans chacun d'eux :

> Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.
>
> Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Faire suivre ces paragraphes de la même solution de repli :

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

Placer les orientations propres au domaine dans les sections suivantes. Les consignes propres au monorepo, notamment la consultation des sources avant le premier build, restent dans les ressources internes de contribution.

## Conserver les exemples dans des fichiers TypeScript

**Tout exemple de code TypeScript doit être dans un fichier `.ts` vérifié par le typage**, lié depuis le Markdown qui explique quand le consulter. Ne pas conserver de blocs TypeScript dans `SKILL.md` ou ses références et ne pas recopier le même exemple dans le texte.

Placer les exemples propres au skill sous `skills/<nom>/references/examples/`. Garder les dépendances locales de ces exemples dans le même dossier de skill pour qu'une installation par copie reste complète. Les concepts existants se consultent dans le package installé ; ne pas utiliser un lien relatif qui supposerait que le skill copié est encore voisin de `docs/`.

Avant de modifier un exemple, lire les [règles d'importation](../../../../../.agents/importations.md). Utiliser les exports publics des packages, sans alias interne au monorepo ni import de sources privées. Vérifier que les dépendances utilisées sont déclarées par AgentKit.

Choisir de petits exemples qui démontrent une décision ou une garantie précise. Expliquer ce qui reste vrai lorsque le scénario change, sans transformer les noms, valeurs ou détails du cas illustré en règle générale. Identifier les contournements d'inférence et limites d'API comme des difficultés conditionnelles. Ajouter des commentaires sur ce que le code ne dit pas à lui seul. Pour les garanties importantes, utiliser `DCommon.ExpectType` et, pour une construction volontairement refusée, un `@ts-expect-error` expliqué. Ces vérifications doivent échouer si la garantie illustrée disparaît ; ne pas contourner le typage pour maintenir l'exemple.

Le [tsconfig documentaire](../../../tsconfig.doc.json) inclut `skills/**/*.ts`. Vérifier que chaque nouvel exemple y entre effectivement et qu'il est aussi couvert par le lint. Pour un comportement que la compilation seule ne garantit pas, comme un chargement d'extension ou une génération de fichiers, vérifier l'exécution pertinente dans un environnement temporaire adapté.

## Intégrer un skill installable

Créer le dossier sous `skills/<nom>/` et choisir un `name` cohérent avec son nom installé `duplojs-<nom>`. Ajouter la clé `<nom>` à **`SkillEnum` dans [scripts/bin/install/skill.ts](../../../scripts/bin/install/skill.ts)** lors de l'ajout d'un nouveau skill. Lors d'une modification, vérifier que cette entrée existe déjà.

Les tests de l'installateur couvrent ses comportements avec un ou deux skills représentatifs : sélection, installation complète, copie, liens, destinations, remplacement et erreurs. Ne pas ajouter de cas pour chaque nouveau skill lorsque le mécanisme d'installation reste identique. Ajouter un test seulement si un nouveau comportement ou un cas d'usage spécifique le justifie.

Conserver un contrôle global entre `SkillEnum` et les dossiers distribués, et un inventaire automatique pour l'installation complète dans les [tests d'installation](../../../integrations/install.test.ts). Vérifier ainsi que les références et exemples sont distribués ensemble, en copie comme en lien symbolique, sans maintenir une nouvelle liste de scénarios par skill. Le champ `files` du package doit continuer à inclure les ressources nécessaires.

## Vérifier le résultat

- Valider les métadonnées et la structure selon `skill-creator`, ainsi que les liens vers les références, les exemples et les concepts.
- Relire le skill entier et ses références modifiées face aux concepts utilisés : démarche cohérente, absence de contradiction ou de répétition, portée correcte et volume de consignes proportionné au besoin. Vérifier que le remaniement reste limité aux parties concernées, que les exemples sont identifiés comme tels et que les détails se chargent à la demande.
- Pour une création ou une refonte de démarche, évaluer des tâches représentatives avec les modèles et environnements ciblés. Mesurer la réussite, le respect des garanties, les lectures et le coût total, raisonnement, échecs et reprises compris. Une instruction plus courte n'est pas nécessairement plus économique sur la tâche entière. La compilation et les tests d'installation ne prouvent pas l'efficacité pédagogique ; distinguer recommandations non mesurées et résultats observés. Adapter l'effort de validation à l'ampleur du changement.
- Construire le package avec `pnpm --filter @duplojs/agents-kit build`, puis vérifier le typage avec `pnpm --filter @duplojs/agents-kit test:types` et le lint avec `pnpm --filter @duplojs/agents-kit test:lint`.
- Lorsque l'ensemble installable ou ses ressources change, exécuter les tests d'installation après le typage et le lint pour vérifier la distribution complète du skill.
- Vérifier que le contenu destiné aux consommateurs ne suppose ni l'arborescence ni les alias du monorepo, et qu'il retrouve la documentation après une installation par copie.
