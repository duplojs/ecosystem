---
name: ai-docs
description: Créer, organiser, maintenir ou corriger l'AI Doc de l'écosystème DuploJS dans `ai-docs/src`, en respectant sa structure, son routage conceptuel et les règles d'exposition utilisées pour générer le `LLMS.md`.
---

# AI Docs

Ce skill encadre la rédaction et la maintenance de l'AI Doc de l'écosystème DuploJS.

La source de vérité se trouve dans :

```text
ai-docs/src/
```

Le `LLMS.md` est généré à partir de cette arborescence.

Toute évolution de la documentation est réalisée dans `ai-docs/src`.

## Principe général

L'AI Doc distingue deux niveaux d'information :

- **le routage**, qui permet d'identifier le domaine, le concept et la ressource pertinente ;
- **la documentation**, qui permet ensuite de comprendre et d'utiliser ce concept.

Le routage est volontairement compact.

Il indique **où se trouve une connaissance et ce qu'elle concerne**.

Il privilégie les titres explicites, les mots-clés et les descriptions succinctes qui permettent à l'agent de trouver la ressource adaptée à son besoin.

La documentation porte les explications, les exemples, les comportements, les règles d'utilisation, les garanties de typage et les subtilités nécessaires à la compréhension.

Ces deux niveaux doivent rester distincts pour éviter de surcharger le `LLMS.md` avec des informations qui ne servent pas au routage.

## Parcours de l'AI Doc

Le parcours commence dans :

```text
ai-docs/src/
```

Les dossiers dont le nom possède un préfixe numérique sont parcourus.

```text
01-fundamental/
02-server/
03-client/
04-tests/
```

Cette règle s'applique récursivement :

```text
01-fundamental/
  01-constraint/
  02-currying/
  03-either/
```

Un dossier parcouru peut contenir :

- un `index.md` ;
- des fichiers TypeScript documentaires ;
- des fichiers Markdown documentaires ;
- d'autres dossiers numérotés ;
- des ressources auxiliaires non parcourues.

Les fichiers documentaires sont reconnus par leur préfixe numérique. Les `index.md` sont également parcourus.

L'ordre repose sur le nom des ressources.

Les préfixes numériques utilisent donc toujours une représentation sur deux chiffres afin que l'ordre lexical corresponde à l'ordre attendu.

## Numérotation des dossiers

Les dossiers parcourus utilisent des préfixes ordinaux sur deux chiffres :

```text
01-constraint/
02-currying/
03-either/
04-data-structure/
```

Le nombre indique uniquement leur ordre relatif dans le niveau courant de l'arborescence.

Lorsqu'un nouveau domaine est ajouté, conserver cette organisation simple et lisible.

## Numérotation des fichiers documentaires

Les fichiers TypeScript et Markdown parcourus suivent la même convention de numérotation.

Deux espaces de numérotation existent.

### `01` à `09` — contenu directement exposé

Les préfixes commençant par `0` sont réservés aux ressources dont le contenu exposable doit être intégré directement au `LLMS.md`.

```text
01-use.md
02-built-in-function.ts
03-other-fundamental.md
```

Les valeurs disponibles sont :

```text
01
02
03
04
05
06
07
08
09
```

Elles permettent d'ordonner plusieurs connaissances fondamentales dans un même domaine.

La manière dont le contenu est exposé dépend du format :

- pour TypeScript, le header et le contenu documentaire sont intégrés au `LLMS.md` ;
- pour Markdown, seule la partie de routage précédant `---` est intégrée au `LLMS.md`, indépendamment du préfixe.

### `10` à `90` — documentation chargée à la demande

Les autres fichiers documentaires utilisent exclusivement les dizaines :

```text
10
20
30
40
50
60
70
80
90
```

Exemple :

```text
01-use.md
02-built-in-function.ts
10-built-in-constraint.ts
20-cast.md
30-custom-constraint.ts
```

Cette échelle constitue directement la convention d'organisation.

Une nouvelle ressource prend l'une des positions disponibles parmi :

```text
10, 20, 30, 40, 50, 60, 70, 80, 90
```

Les valeurs intermédiaires comme :

```text
15
25
35
42
55
```

ne font pas partie de la convention.

L'ordre documentaire doit être pensé avec les positions prévues plutôt qu'en insérant ultérieurement des valeurs intermédiaires.

Cette organisation garantit un classement lexical stable, immédiatement lisible et cohérent dans toute l'AI Doc.

## Ressources auxiliaires non parcourues

Les fichiers et dossiers sans préfixe numérique ne participent pas directement au parcours, à l'exception des `index.md`.

Exemple :

```text
01-constraint/
  index.md
  01-use.md
  10-built-in-constraint.ts
  fixtures/
    user.ts
    values.ts
```

`fixtures/` est ici une ressource auxiliaire.

Ces ressources servent de support à la documentation parcourue et peuvent notamment contenir :

- des fixtures ;
- du setup partagé ;
- des données d'exemple ;
- des types ou fonctions réutilisés ;
- des fragments référencés par plusieurs documents.

Elles peuvent être utilisées ou citées depuis un fichier documentaire.

Elles ne constituent pas elles-mêmes une étape du routage et leur contenu n'est pas directement exposé dans le `LLMS.md`.

## Génération du `LLMS.md`

La manière dont une ressource est exposée dépend de son format et de son contenu.

### Fichiers Markdown

Tous les fichiers Markdown parcourus suivent la même règle d'exposition.

Cela concerne :

- les `index.md` ;
- les fichiers Markdown numérotés de `01` à `09` ;
- les fichiers Markdown numérotés de `10` à `90`.

Un fichier Markdown peut contenir deux parties séparées par une ligne contenant exactement :

```text
---
```

**Avant le premier séparateur :**

- le contenu est intégré au `LLMS.md` ;
- il joue exactement le même rôle que le header d'un fichier TypeScript ;
- il sert exclusivement au routage conceptuel de l'agent ;
- il fournit un titre, des mots-clés et une description succincte du périmètre couvert ;
- il permet à l'agent d'identifier rapidement si le fichier correspond à son besoin ;
- il ne contient ni explications détaillées, ni exemples, ni connaissances destinées à être enseignées directement.

**Après le premier séparateur :**

- le contenu reste uniquement dans le fichier Markdown ;
- il contient les explications nécessaires à la compréhension du sujet ;
- il peut référencer et contextualiser des exemples documentaires ;
- il n'est pas intégré au `LLMS.md`.

Le séparateur lui-même n'est pas intégré au `LLMS.md`.

Lorsqu'un fichier Markdown ne possède pas de séparateur, l'intégralité de son contenu est intégrée au `LLMS.md`. Ce contenu doit donc respecter les règles du routage conceptuel.

Cette règle est indépendante du nom du fichier et de son préfixe numérique.

#### Exemple

Un fichier `20-entity.md` peut contenir :

```md
## Entity

Identité, création, hydratation et cycle de vie des entités.

---

Les entités possèdent une identité qui permet de les distinguer indépendamment de leurs propriétés.

Pour comprendre la création et l'hydratation, consulter [10-hydration.ts](./10-hydration.ts).

Les transitions du cycle de vie sont détaillées dans [20-lifecycle.ts](./20-lifecycle.ts).
```

Seule la partie précédant `---` est intégrée au `LLMS.md`.

Elle permet à l'agent d'identifier le sujet du fichier et de déterminer sa pertinence sans charger son contenu documentaire.

La seconde partie reste dans `20-entity.md` et permet à l'agent, une fois le fichier sélectionné, de comprendre le sujet et d'accéder aux exemples pertinents.

**Le routage indique où trouver une connaissance. Le contenu documentaire transmet cette connaissance.**

### Fichiers TypeScript `01` à `09`

Pour un fichier commençant par `0` :

```text
01-use.ts
02-built-in-function.ts
```

le header est intégré au `LLMS.md`.

Le contenu du fichier, sans son header, est également intégré au `LLMS.md`.

Ces fichiers contiennent les connaissances fondamentales qui doivent être directement disponibles dans le contexte initial.

### Fichiers TypeScript `10` à `90`

Pour un fichier utilisant une dizaine :

```text
10-built-in-constraint.ts
20-cast.ts
30-custom-constraint.ts
```

le header est intégré au `LLMS.md`.

Le contenu détaillé reste dans le fichier source.

Le routage généré permet à l'agent d'accéder à ce fichier lorsque son sujet devient pertinent.

## Routage conceptuel

Les headers TypeScript et les parties exposées des fichiers Markdown constituent les surfaces de routage.

Le routage décrit **la connaissance portée par une ressource**, sans chercher à l'enseigner.

Il est construit à partir :

- du concept présenté ;
- du problème traité ;
- de la capacité apportée ;
- des garanties ou mécanismes étudiés.

Les titres, descriptions et mots-clés permettent à l'agent de reconnaître la ressource adaptée à sa recherche.

Les exemples utilisent nécessairement des fonctions, des types et des valeurs concrètes.

Ces éléments servent à démontrer le concept.

Le routage reste centré sur le concept lui-même.

### Exemple

Un fichier peut contenir :

```ts
type Age = number & DNumber.Integer & DNumber.Positive;

const maybeAge = 12;

if (
  DNumber.isInteger(maybeAge)
  && DNumber.isPositive(maybeAge)
) {
  const age: Age = maybeAge;
}
```

Le sujet peut être l'acquisition d'une contrainte après vérification runtime.

Son header peut alors être :

```ts
/**
 * @title Utilisation des `Constraint`.
 *
 * Vérification runtime, narrowing et acquisition
 * de garanties supplémentaires dans le typage.
 */
```

`isInteger` et `isPositive` sont ici des outils utilisés pour démontrer le concept.

Le routage porte sur la connaissance que leur combinaison permet d'expliquer.

### Test de stabilité

Pour déterminer si une information appartient au routage, utiliser ce test :

> Si l'exemple était réécrit avec d'autres fonctions tout en enseignant exactement la même chose, cette information resterait-elle pertinente ?

Une information qui reste pertinente décrit généralement le concept.

Une information qui dépend uniquement de la forme particulière de l'exemple appartient généralement au contenu documentaire.

Ce test s'applique aussi bien aux headers TypeScript qu'aux parties exposées des fichiers Markdown.

## `index.md`

Un `index.md` présente le domaine correspondant au dossier dans lequel il se trouve.

Il permet de répondre rapidement à :

> Quel domaine de connaissance est regroupé ici ?

Il utilise une présentation courte et des termes caractéristiques du domaine.

Exemple :

```md
## Constraint

Déclaration, vérification, composition et acquisition de contraintes sur les valeurs.
```

L'index sert au routage vers le domaine.

Les fichiers contenus dans ce domaine développent ensuite les différentes connaissances.

La granularité de l'index correspond à sa position dans l'arborescence :

- un index haut placé présente un domaine large ;
- un index plus profond présente un domaine plus spécialisé.

## Headers TypeScript

Tous les fichiers TypeScript parcourus possèdent un header :

```ts
/**
 * @title ...
 *
 * ...
 */
```

Le header route vers le **concept documenté par le fichier**.

Il contient :

1. un `@title` court qui nomme la connaissance principale ;
2. une description succincte de son périmètre conceptuel.

Exemple :

```ts
/**
 * @title Création de `Constraint`.
 *
 * Définition de contraintes personnalisées,
 * validation et garanties ajoutées au typage.
 */
```

Un symbole d'API peut apparaître lorsqu'il représente directement la notion documentée.

Les fonctions utilisées uniquement pour construire ou illustrer un exemple restent des détails documentaires.

### Identifier le sujet d'un fichier

Avant de rédiger le routage, compléter mentalement :

> Ce fichier existe pour apprendre à l'agent...

La réponse doit exprimer la connaissance transmise par la ressource.

Le routage est ensuite construit à partir de cette connaissance, sans en détailler l'enseignement.

Pour un fichier TypeScript, il est exprimé dans le header.

Pour un fichier Markdown, il est exprimé dans la partie précédant le séparateur `---`, ou dans l'intégralité du fichier si aucun séparateur n'est présent.

Les exemples sont au service de ce sujet, et non l'inverse.

## Hiérarchie du routage

Chaque niveau de l'arborescence réduit progressivement l'espace de recherche.

Par exemple :

```text
Fundamental
    ↓
Constraint
    ↓
Création de contraintes personnalisées
    ↓
30-custom-constraint.ts
```

Le dossier situe un grand domaine.

L'`index.md` caractérise ce domaine.

Le header TypeScript ou la partie exposée du Markdown identifie la connaissance portée par une ressource.

Le contenu documentaire fournit son explication.

## Placement de l'information

### Routage

Une information de routage aide à répondre à :

> Quel concept correspond à mon besoin ?

> Dans quel domaine dois-je chercher ?

> Quelle ressource porte cette connaissance ?

Elle appartient généralement à un `index.md`, à la partie exposée d'un Markdown numéroté ou à un header TypeScript.

Le routage utilise des mots-clés et des formulations caractéristiques du sujet pour permettre à l'agent de sélectionner rapidement la ressource pertinente.

Il ne doit pas enseigner le fonctionnement détaillé du concept.

### Documentation

Une information documentaire aide à répondre à :

> Comment ce concept fonctionne-t-il ?

> Comment l'utiliser concrètement ?

> Quelle API permet de l'appliquer ?

> Quel comportement obtient-on ?

> Quelles garanties apporte-t-il ?

Elle appartient au contenu documentaire du fichier concerné.

Dans un fichier Markdown, elle est placée après `---`.

Dans un fichier TypeScript, elle appartient au contenu situé après le header.

## Contenu documentaire

### Markdown

Le contenu Markdown situé après `---` porte les explications complémentaires au sujet annoncé par le routage.

Il permet notamment :

- de préciser le fonctionnement d'un concept ;
- de contextualiser les cas d'utilisation ;
- d'expliquer les relations entre plusieurs connaissances ;
- de référencer les fichiers contenant les exemples appropriés ;
- d'orienter l'agent vers les détails nécessaires à sa recherche.

Les exemples TypeScript sont conservés dans les fichiers documentaires correspondants.

Le Markdown référence ces exemples sans dupliquer leur implémentation.

### TypeScript

Le contenu TypeScript porte l'explication concrète du sujet annoncé par son header.

Il combine du code typable et des commentaires utiles à la compréhension.

Les commentaires peuvent notamment expliquer :

- le raisonnement derrière l'exemple ;
- le comportement observé ;
- les garanties obtenues ;
- les différentes formes d'utilisation ;
- les subtilités importantes ;
- le rôle des API mobilisées.

Plusieurs fonctions peuvent être utilisées ensemble lorsqu'elles permettent d'illustrer correctement le concept documenté.

## Qualité des exemples

Les exemples doivent être :

- typables ;
- représentatifs d'un usage réel ;
- centrés sur la connaissance documentée ;
- suffisamment petits pour rendre cette connaissance identifiable ;
- cohérents avec les conventions de l'écosystème ;
- réutilisables lorsque cela est pertinent.

Le choix des API utilisées dans un exemple découle du concept à démontrer.

## Choix du niveau d'exposition

Le niveau d'exposition est choisi avant la numérotation du fichier.

### Connaissance fondamentale

Lorsqu'une connaissance TypeScript doit être directement disponible dans le contexte initial, choisir une position disponible entre `01` et `09`.

### Connaissance chargée à la demande

Lorsque le routage suffit pour permettre de découvrir une ressource TypeScript, choisir une position disponible parmi :

```text
10
20
30
40
50
60
70
80
90
```

La position choisie représente également l'ordre logique de lecture dans le domaine.

Pour les fichiers Markdown, quelle que soit leur numérotation, le `LLMS.md` reçoit exclusivement le routage situé avant `---`, ou l'intégralité du fichier lorsque ce séparateur est absent.

Les explications Markdown sont destinées à être consultées à la demande, après identification de la ressource par son routage.

## Vérification des informations

Avant de documenter un concept :

1. identifier le concept à transmettre ;
2. identifier les packages concernés ;
3. vérifier leurs exports publics ;
4. lire les signatures TypeScript utiles ;
5. consulter l'implémentation lorsque le comportement nécessite confirmation ;
6. consulter les tests lorsqu'ils précisent le contrat ;
7. examiner les documentations voisines pour conserver une terminologie cohérente ;
8. construire les exemples à partir du concept identifié.

La documentation doit correspondre aux comportements réellement disponibles dans l'écosystème.

## Imports

Avant de créer ou modifier un exemple TypeScript, lire :

```text
.agents/importations.md
```

Les exemples de l'AI Doc suivent les conventions d'importation du projet.

## Création d'une documentation

Lorsqu'une nouvelle documentation est ajoutée :

1. identifier la connaissance à transmettre ;
2. identifier son domaine ;
3. choisir sa position dans `ai-docs/src` ;
4. déterminer son niveau d'exposition ;
5. sélectionner un préfixe conforme à la convention de numérotation ;
6. positionner logiquement la ressource parmi les autres documents du domaine ;
7. rédiger son routage conceptuel : header TypeScript ou partie Markdown précédant `---` ;
8. construire le contenu documentaire et les exemples au service de ce concept ;
9. placer les explications et références complémentaires des Markdown après `---` ;
10. adapter l'`index.md` lorsque le périmètre du domaine évolue ;
11. vérifier les API utilisées ;
12. valider les exemples TypeScript.

## Révision de l'existant

Lorsqu'une documentation existante est révisée :

1. identifier le concept réellement transmis par chaque ressource ;
2. vérifier que son routage permet de retrouver ce concept ;
3. recentrer les routages dérivés trop directement des fonctions présentes dans les exemples ;
4. retirer des routages les explications et connaissances qui ne servent pas à identifier les ressources ;
5. conserver les détails d'API dans le contenu documentaire ;
6. replacer les explications détaillées dans les fichiers correspondants ;
7. vérifier que les Markdown séparent correctement le routage et la documentation avec `---` ;
8. réduire les duplications ;
9. vérifier la conformité de la numérotation ;
10. replacer les fichiers utilisant des préfixes intermédiaires vers une position valide.

Pour les fichiers détaillés, les positions valides sont uniquement :

```text
10, 20, 30, 40, 50, 60, 70, 80, 90
```

La révision doit aboutir à une arborescence dont l'ordre est immédiatement compréhensible à partir des noms de fichiers.

## Validation

Avant de terminer une modification, vérifier :

- la position de la ressource dans l'arborescence ;
- l'ordre lexical attendu ;
- l'utilisation d'un préfixe sur deux chiffres ;
- l'utilisation de `01` à `09` pour les connaissances fondamentales directement exposées ;
- l'utilisation exclusive de `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80` ou `90` pour les autres fichiers documentaires ;
- l'application des mêmes conventions de numérotation aux fichiers Markdown et TypeScript ;
- le niveau d'exposition choisi ;
- la concision des `index.md` ;
- la capacité des `index.md` à router vers leur domaine conceptuel ;
- la capacité des headers TypeScript et des parties exposées des Markdown à identifier le véritable sujet des fichiers ;
- la présence de titres, descriptions et mots-clés pertinents dans les surfaces de routage ;
- l'absence d'explications détaillées et d'exemples dans les parties Markdown destinées au `LLMS.md` ;
- l'intégration exclusive du contenu Markdown précédant le premier `---` dans le `LLMS.md` ;
- la conservation du contenu Markdown suivant `---` uniquement dans le fichier source ;
- l'intégration complète des Markdown ne possédant pas de séparateur, dont le contenu doit être exclusivement consacré au routage ;
- la priorité donnée au concept plutôt qu'aux détails des exemples ;
- la présence des explications dans le contenu documentaire ;
- la faible duplication entre routage et documentation ;
- l'exactitude des API utilisées ;
- la conformité des imports ;
- le typage des exemples modifiés.