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

La documentation porte les explications, les exemples, les comportements, les règles d'utilisation, les garanties de typage et les subtilités nécessaires à la compréhension.

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
- d'autres dossiers numérotés ;
- des ressources auxiliaires non parcourues.

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

Les fichiers TypeScript parcourus suivent une convention différente et stricte.

Deux espaces de numérotation existent.

### `01` à `09` — contenu directement exposé

Les préfixes commençant par `0` sont réservés aux fichiers dont le contenu doit être intégré directement au `LLMS.md`.

```text
01-use.ts
02-built-in-function.ts
03-other-fundamental.ts
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

Elles permettent d'ordonner plusieurs connaissances fondamentales directement exposées dans un même domaine.

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
01-use.ts
02-built-in-function.ts
10-built-in-constraint.ts
20-cast.ts
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

Les fichiers et dossiers sans préfixe numérique ne participent pas directement au parcours.

Exemple :

```text
01-constraint/
  01-use.ts
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

Elles peuvent être utilisées ou citées depuis un `index.md` ou un fichier documentaire.

Elles ne constituent pas elles-mêmes une étape du routage et leur contenu n'est pas directement exposé dans le `LLMS.md`.

## Génération du `LLMS.md`

La manière dont une ressource est exposée dépend de son type.

### `index.md`

Le contenu d'un `index.md` est intégré directement au `LLMS.md`.

Il constitue une surface de routage vers un domaine de connaissance.

### Fichiers `01` à `09`

Pour un fichier commençant par `0` :

```text
01-use.ts
02-built-in-function.ts
```

le header est intégré au `LLMS.md`.

Le contenu du fichier, sans son header, est également intégré au `LLMS.md`.

Ces fichiers contiennent les connaissances fondamentales qui doivent être directement disponibles dans le contexte initial.

### Fichiers `10` à `90`

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

Les `index.md` et les headers constituent les surfaces de routage.

Le routage décrit **la connaissance portée par une ressource**.

Il est construit à partir :

- du concept présenté ;
- du problème traité ;
- de la capacité apportée ;
- des garanties ou mécanismes étudiés.

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

## `index.md`

Un `index.md` présente le domaine correspondant au dossier dans lequel il se trouve.

Il permet de répondre rapidement à :

> Quel domaine de connaissance est regroupé ici ?

Il utilise une présentation courte et des termes caractéristiques du domaine.

Exemple :

```md
## Constraint

Modélisation de garanties supplémentaires sur les valeurs :
déclaration, vérification, composition et acquisition de contraintes.
```

L'index décrit le domaine.

Les fichiers contenus dans ce domaine développent ensuite les différentes connaissances.

La granularité de l'index correspond à sa position dans l'arborescence :

- un index haut placé présente un domaine large ;
- un index plus profond présente un domaine plus spécialisé.

## Headers

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

Avant de rédiger le header, compléter mentalement :

> Ce fichier existe pour apprendre à l'agent...

La réponse doit exprimer la connaissance transmise par la ressource.

Le header est ensuite construit à partir de cette connaissance.

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

Le header identifie la connaissance portée par une ressource.

Le contenu TypeScript fournit son explication.

## Placement de l'information

### Routage

Une information de routage aide à répondre à :

> Quel concept correspond à mon besoin ?

> Dans quel domaine dois-je chercher ?

> Quelle ressource porte cette connaissance ?

Elle appartient généralement à un `index.md` ou à un header.

### Documentation

Une information documentaire aide à répondre à :

> Comment ce concept fonctionne-t-il ?

> Comment l'utiliser concrètement ?

> Quelle API permet de l'appliquer ?

> Quel comportement obtient-on ?

> Quelles garanties apporte-t-il ?

Elle appartient au contenu du fichier TypeScript.

## Contenu documentaire

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

Lorsqu'une connaissance doit être directement disponible dans le contexte initial, choisir une position disponible entre `01` et `09`.

### Connaissance chargée à la demande

Lorsque le header suffit pour permettre de découvrir la ressource, choisir une position disponible parmi :

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
7. rédiger son header conceptuel ;
8. construire le contenu et les exemples au service de ce concept ;
9. adapter l'`index.md` lorsque le périmètre du domaine évolue ;
10. vérifier les API utilisées ;
11. valider les exemples TypeScript.

## Révision de l'existant

Lorsqu'une documentation existante est révisée :

1. identifier le concept réellement transmis par chaque ressource ;
2. vérifier que son `index.md` ou son header route vers ce concept ;
3. recentrer les routages dérivés trop directement des fonctions présentes dans les exemples ;
4. conserver les détails d'API dans le contenu documentaire ;
5. replacer les explications détaillées dans les fichiers correspondants ;
6. réduire les duplications ;
7. vérifier la conformité de la numérotation ;
8. replacer les fichiers utilisant des préfixes intermédiaires vers une position valide.

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
- l'utilisation de `01` à `09` pour les contenus directement exposés ;
- l'utilisation exclusive de `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80` ou `90` pour les autres fichiers documentaires ;
- le niveau d'exposition choisi ;
- la concision des `index.md` ;
- la capacité des `index.md` à router vers leur domaine conceptuel ;
- la capacité des headers à exprimer le véritable sujet des fichiers ;
- la priorité donnée au concept plutôt qu'aux détails des exemples ;
- la présence des explications dans le contenu documentaire ;
- la faible duplication entre routage et documentation ;
- l'exactitude des API utilisées ;
- la conformité des imports ;
- le typage des exemples modifiés.