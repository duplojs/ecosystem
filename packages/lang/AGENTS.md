# @duplojs/lang

`@duplojs/lang` est la brique fondamentale de l'écosystème DuploJS.

Son objectif est de compléter TypeScript avec les primitives, utilitaires et structures nécessaires pour concevoir, manipuler, transformer et vérifier les données de manière robuste et prédictible.

Le package fournit notamment :

* des utilitaires génériques absents ou insuffisants dans le langage;
* des alternatives fonctionnelles aux opérations pouvant introduire de la mutation;
* des structures permettant de représenter et contraindre les données;
* des outils de composition et de modélisation destinés à construire des bases de code durables.

## Principes

`@duplojs/lang` privilégie :

* la programmation fonctionnelle;
* l'immutabilité;
* des comportements explicites et prédictibles;
* une forte exploitation du système de types TypeScript;
* le Type-Driven Development;
* le Domain-Driven Development.

Les fonctionnalités doivent rester génériques et indépendantes d'un contexte applicatif particulier.

## Indépendance de la plateforme

`@duplojs/lang` ne dépend d'aucune plateforme d'exécution.

Il doit pouvoir être utilisé aussi bien dans un navigateur que dans Node.js, Bun, Deno ou tout autre environnement JavaScript compatible.

Les fonctionnalités dépendantes d'une plateforme, d'un système ou d'une infrastructure n'appartiennent pas à ce package.

## Contraintes de typage

Les contraintes sont un mécanisme fondamental de `@duplojs/lang`.

Elles permettent d'enrichir les types TypeScript avec des garanties supplémentaires établies à partir de vérifications, d'inférences ou d'autres informations déjà connues par le système de types.

Avant de modifier ou créer une fonctionnalité manipulant des contraintes, consulter :

* [Contraintes de typage](./.agents/constraints.md)

## Domaines

Les fonctionnalités sont réparties en domaines indépendants.

Chaque domaine peut posséder son propre `AGENTS.md`, qui constitue le point d'entrée à consulter avant de travailler sur celui-ci.

* [`array`](./scripts/array) : manipulation fonctionnelle et fortement typée des tableaux.
* [`chrono`](./scripts/chrono) : manipulation des valeurs et opérations liées au temps.
* [`common`](./scripts/common) : primitives et utilitaires communs aux différents domaines.
* [`dataStructure`](./scripts/dataStructure) : représentation, validation et construction de contrats de données.
* [`either`](./scripts/either) : représentation explicite d'une opération pouvant réussir ou échouer.
* [`generator`](./scripts/generator) : utilitaires fonctionnels autour des générateurs.
* [`invocation`](./scripts/invocation) : primitives liées à l'invocation et à la composition de fonctions.
* [`kind`](./scripts/kind) : primitives permettant de caractériser et différencier des structures typées.
* [`modeling`](./scripts/modeling) : outils dédiés à la modélisation des données.
* [`number`](./scripts/number) : manipulation fonctionnelle et typage des nombres.
* [`object`](./scripts/object) : manipulation et transformation fonctionnelle des objets.
* [`path`](./scripts/path) : représentation et manipulation de chemins dans des structures de données.
* [`pattern`](./scripts/pattern) : primitives de pattern matching et de composition conditionnelle.
* [`printer`](./scripts/printer) : outils de représentation et de production de valeurs textuelles.
* [`string`](./scripts/string) : manipulation fonctionnelle et typage des chaînes de caractères.
* [`tuple`](./scripts/tuple) : manipulation et typage des tuples.

## Avant de modifier un domaine

Avant d'intervenir dans un domaine :

1. consulter son `AGENTS.md` lorsqu'il existe;
2. vérifier les primitives déjà présentes avant d'en ajouter une nouvelle;
3. préserver les conventions de composition et de typage existantes;
4. considérer le comportement runtime et le comportement TypeScript comme faisant partie du même contrat;
5. vérifier l'impact de toute transformation sur les contraintes de typage concernées.
