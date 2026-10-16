---
name: duplojs-modeling
description: "Comprendre, concevoir ou faire évoluer un système métier DuploJS en Type-Driven Design : domaine, cycles de vie, agrégats, preuves, use cases et raccordement à l'infrastructure. S'applique aussi à l'implémentation d'une couche autour d'un domaine existant."
---

# Modélisation métier DuploJS

## Trouver les concepts

Pour rechercher un concept ou une façon de faire, consulter en priorité `docs/concepts.llms.md` dans le package `@duplojs/agents-kit` et lire uniquement les pages et exemples pertinents pour la tâche. Le setup indique son chemin dans `AGENTS.md` ou `CLAUDE.md` : le résoudre depuis le dossier de ce fichier. Les chemins `docs/` partent de la racine du package installé ; les liens de chaque document se résolvent depuis son dossier. Même avec `--copy`, la documentation reste dans le package installé ; les références propres au skill se résolvent depuis son `SKILL.md`.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Comprendre avant d'implémenter

Ici, TDD signifie **Type-Driven Design**. Le domaine exprime le métier et impose ses garanties par ses types. Avant toute implémentation, même uniquement applicative ou technique, lire les concepts et les contrats du domaine concerné. Ne pas se contenter des titres du routeur.

Depuis la racine du package installé, lire :

- `docs/concepts/05-type-driven-design/01-architecture/10-boundaries.md` pour les opérations autorisées par couche ;
- les pages `10-entities.md`, `20-aggregates.md` et `30-repositories.md` de `docs/concepts/05-type-driven-design/02-domains/` pour les invariants, transitions et exigences du métier ;
- les pages `03-applications/10-use-case.md` et `04-infrastructure/10-implementation.md` de `docs/concepts/05-type-driven-design/` pour préparer, exécuter et raccorder ces contrats ;
- les exemples pertinents de `docs/concepts/01-fundamental/06-modeling/`, notamment `40-entity-lifecycle.ts` et `50-evidence.ts`, avant de manipuler des états ou des preuves. Lire aussi les exemples DataStructure, NewType, Entity, TaggedObject ou SignedFunction lorsque ces primitives interviennent.

Dans le projet consommateur, retrouver les entités, qualifications, faits, agrégats, repositories et use cases de l'opération. Suivre leurs imports et lire les signatures ainsi que les implémentations concernées. Reconstituer, pour chaque opération :

| À comprendre | Questions à résoudre dans les contrats |
| --- | --- |
| Données et invariants | Quelles valeurs et formes sont autorisées pour toute entité ? |
| Conditions d'entrée | Quels flags, évidences et relations sont exigés ? Qui les établit ? |
| Événement | Quels faits modifient quelles cibles ? Dans quel ordre ? |
| Sorties | Quels nouveaux états, faits courants, résultats et effets sont produits ? |
| Refus | Quelles branches empêchent de continuer ? Quelle couche les traite ? |

Utiliser cette compréhension pour implémenter le périmètre demandé. Si le domaine est fourni par l'utilisateur, conserver ses contrats ; une difficulté de raccordement ne justifie pas de retirer une précondition ou de déplacer une règle. Si une règle métier nécessaire manque ou se contredit, isoler la décision à clarifier et avancer sur les parties indépendantes.

## Respecter les couches

| Couche | Dépendances et responsabilités |
| --- | --- |
| Domaine | N'importe ni application ni infrastructure. Définit les modèles, qualifications, faits, agrégats et contrats des repositories. Les agrégats restent purs. |
| Application | Importe le domaine. Définit ses ports, appelle les repositories, prépare les preuves, appelle les agrégats, résout les effets et persiste les résultats. N'importe pas l'infrastructure. |
| Infrastructure | Importe domaine et application. Implémente les ports, hydrate les données, résout les Readers et adapte les points d'entrée aux contrats. |

L'entrée habituelle d'une opération métier dans le domaine est un **agrégat appelé par un use case**. Le domaine orchestre les règles et les faits ; l'application orchestre leurs besoins techniques. Un repository est un contrat de capacité extérieure au domaine, pas nécessairement un accès à une base de données.

L'infrastructure peut appeler directement une opération de lecture de repository, comme `findById` ou `findMany`, et une qualification du domaine pour préparer une entrée. Ne pas imposer un use case de simple relais. Dès qu'il faut conduire une opération métier, ses transitions ou ses effets, passer par l'orchestration applicative. Ne pas appeler directement un fait ou un agrégat depuis un point d'entrée.

## Choisir les garanties du modèle

| Besoin | Choix |
| --- | --- |
| Vérifier une donnée et ses contraintes au runtime | `DataStructure` ; réutiliser les structures du domaine aux frontières. |
| Distinguer deux valeurs de même représentation mais de sens différent | `NewType`. |
| Porter une identité et une shape métier stable | `Entity`. |
| Faire varier la forme d'une propriété selon son cas | Union de `TaggedObject` dans la shape commune. |
| Prouver une condition actuelle de l'entité | `Flag`, établi par une qualification ou par le fait qui produit cette condition. Plusieurs flags compatibles peuvent coexister. |
| Créer une entité ou modifier ses propriétés métier | `Fact` ciblant une seule entité, même si le changement ne modifie pas son état nommé. |
| Exiger un passage, un résultat ou une provenance | `Evidence` et `GetEvidenceResult` dans le contrat qui porte cette exigence. |
| Exiger une opération identifiée, au-delà de sa signature d'appel | `SignedFunction`. |
| Déclarer des effets à exécuter autour des résultats métier | `Resolver` retourné par l'agrégat, exécuté par l'application. |

Pour concevoir ou modifier le domaine, lire [Modèles et transitions](references/domain.md). Pour raccorder les contrats à l'application et à l'infrastructure, lire [Des preuves aux points d'entrée](references/orchestration.md).

## Implémenter et vérifier l'opération

Partir du contrat de l'agrégat, puis remonter les exigences vers ses appelants. Décider pour chaque entrée si le use case reçoit une valeur déjà qualifiée ou l'obtient à travers ses ports. Conserver le type métier exigé jusque dans la validation HTTP, CLI ou autre frontière ; un cast ne produit aucune garantie.

Vérifier que chaque preuve est établie par une opération réelle, que seules les branches autorisées atteignent l'agrégat et que l'enchaînement utilise les nouvelles entités retournées. Vérifier aussi le sens des imports et l'ordre entre effets et persistance. Un `Left` attendu doit empêcher les étapes qui nécessitent le résultat positif.

Exécuter le typage et les vérifications du projet. Pour les garanties ajoutées, vérifier les entrées acceptées et refusées par les types ; pour le comportement, couvrir les transitions et les branches de refus concernées, ainsi que l'absence d'effets après un refus. Ne pas transformer un échec de typage en cast ni apposer une preuve à la place de l'opération requise.
