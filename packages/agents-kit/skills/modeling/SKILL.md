---
name: duplojs-modeling
description: "Comprendre, concevoir ou faire évoluer un système métier DuploJS en Type-Driven Design : domaine, cycles de vie, agrégats, preuves, use cases et raccordement à l'infrastructure. S'applique aussi à l'implémentation d'une couche autour d'un domaine existant."
---

# Modélisation métier DuploJS

## Trouver les concepts

Appliquer la démarche du skill et lire les ressources indiquées lorsque leur condition est rencontrée. Pour rechercher un concept ou un mécanisme non couvert, consulter `docs/concepts.llms.md` du package `@duplojs/agents-kit`.

Le setup indique ce chemin dans `AGENTS.md` ou `CLAUDE.md`, relativement à leur dossier. Les chemins `docs/` partent du package installé, même avec `--copy`. Les références du skill partent de son dossier ; les liens d'un document se résolvent depuis ce document.

Si le chemin du routeur manque, le retrouver depuis le projet consommateur :

```sh
node --input-type=module -e 'import { fileURLToPath } from "node:url"; console.log(fileURLToPath(import.meta.resolve("@duplojs/agents-kit/docs/concepts.llms.md")))'
```

## Délimiter l'intervention

Ici, TDD signifie **Type-Driven Design**. Le domaine exprime le métier et impose ses garanties par ses types. Partir de l'opération concernée et choisir la lecture selon la responsabilité modifiée :

| Intervention | Contrats à examiner et référence à lire |
| --- | --- |
| Concevoir ou modifier un modèle, une qualification ou une transition | Invariants, faits et agrégats concernés : [Modèles et transitions](references/domain.md). |
| Modifier un use case | Préconditions de l'agrégat, ports, refus, effets et persistance : [Des preuves aux points d'entrée](references/orchestration.md). |
| Raccorder un point d'entrée ou implémenter un port existant | Contrat consommé, préparation des entrées et garanties produites : [Des preuves aux points d'entrée](references/orchestration.md). |

## Comprendre le contrat et les faits concernés

Lire les entrées, garanties, sorties et refus du contrat actuel. Lorsqu'un agrégat intervient, lire son implémentation et les faits qu'il appelle : leurs préconditions, leurs cibles et leur ordre expliquent les transitions et l'intention de l'opération. Lire aussi les qualifications ou opérations qui établissent les garanties requises ; une signature seule ne prouve pas leur réalisation.

Étendre la lecture si une précondition, une provenance, un effet ou une responsabilité nécessaire reste inexpliqué. Arrêter l'exploration lorsque les contrats et les faits concernés permettent de réaliser et vérifier la modification ; les autres parcours du domaine restent hors de cette lecture.

Pour raccorder un domaine fourni, conserver ses contrats : une difficulté technique ne justifie pas de retirer une précondition ou de déplacer une règle. Si une décision métier nécessaire manque ou se contredit, isoler la question et avancer sur les parties indépendantes.

## Respecter les couches

| Couche | Dépendances et responsabilités |
| --- | --- |
| Domaine | N'importe ni application ni infrastructure. Définit les modèles, qualifications, faits, agrégats et contrats des repositories. Les agrégats restent purs. |
| Application | Importe le domaine. Définit ses ports, appelle les repositories, prépare les preuves, appelle les agrégats, résout les effets et persiste les résultats. N'importe pas l'infrastructure. |
| Infrastructure | Importe domaine et application. Implémente les ports, hydrate les données, résout les Readers et adapte les points d'entrée aux contrats. |

L'entrée habituelle d'une opération métier dans le domaine est un **agrégat appelé par un use case**. Le domaine orchestre les règles et les faits ; l'application orchestre leurs besoins techniques. Un repository est un contrat de capacité extérieure au domaine, pas nécessairement un accès à une base de données.

L'infrastructure peut appeler directement une opération de lecture de repository, comme `findById` ou `findMany`, et une qualification du domaine pour préparer une entrée. Ne pas imposer un use case de simple relais. Dès qu'il faut conduire une opération métier, ses transitions ou ses effets, passer par l'orchestration applicative. Ne pas appeler directement un fait ou un agrégat depuis un point d'entrée.

Lorsqu'une tâche crée une couche ou modifie ses responsabilités, lire `docs/concepts/05-type-driven-design/01-architecture/10-boundaries.md`. Pour un raccordement existant, appliquer ces frontières aux contrats concernés.

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

Si le contrat exige une `Evidence` ou `GetEvidenceResult`, lire `docs/concepts/01-fundamental/06-modeling/50-evidence.ts` avant de préparer l'entrée. S'il exige une `SignedFunction`, lire `docs/concepts/01-fundamental/06-modeling/60-signed-function.ts`. Ces mécanismes portent des exigences distinctes : conserver l'opération réelle qui établit la garantie.

## Implémenter et vérifier l'opération

Adapter les appelants du contrat modifié. Pour une opération métier, remonter les exigences de l'agrégat vers le use case et son point d'entrée ; pour une lecture ou une qualification isolée, partir directement de son contrat. Décider qui reçoit les valeurs déjà qualifiées et qui les obtient par ses ports. Conserver les types métier jusque dans la validation externe ; un cast ne produit aucune garantie.

Si la tâche assemble des ports ou des Readers, lire `docs/concepts/05-type-driven-design/03-applications/10-use-case.md` pour leur déclaration et leur résolution. Reader injecte les dépendances du use case ; Resolver exécute les effets déclarés par l'agrégat. Lire le contenu des ressources sélectionnées, pas seulement leurs titres.

Vérifier que chaque preuve est établie par une opération réelle, que seules les branches autorisées atteignent l'agrégat et que l'enchaînement utilise les nouvelles entités retournées. Vérifier aussi le sens des imports et l'ordre entre effets et persistance. Un `Left` attendu doit empêcher les étapes qui nécessitent le résultat positif.

Exécuter le typage et les vérifications du projet. Pour les garanties ajoutées, vérifier les entrées acceptées et refusées par les types ; pour le comportement, couvrir les transitions et les branches de refus concernées, ainsi que l'absence d'effets après un refus. Ne pas transformer un échec de typage en cast ni apposer une preuve à la place de l'opération requise.
