---
name: duplojs-implementation
description: Créer, modifier ou corriger une implémentation dans le monorepo DuploJS en respectant son architecture, ses domaines, ses dépendances et ses conventions d'importation.
---

# Implémentation

Une implémentation doit s'intégrer à l'architecture existante plutôt que créer une nouvelle manière d'organiser ou d'exposer le code.

Avant d'ajouter du code, rechercher si le comportement ou l'utilitaire existe déjà dans le package courant ou dans un autre package de l'écosystème.

Une fonction générique de manipulation de données, indépendante du contexte métier ou technique du package courant, doit notamment être recherchée dans `@duplojs/lang` avant d'être réimplémentée localement.

Lorsqu'une nouvelle primitive est générique, réutilisable et ne dépend d'aucun contexte particulier, considérer son implémentation dans `@duplojs/lang` plutôt que dans un package spécialisé.

## Workflow

1. Identifier le package, le domaine et le comportement concernés.
2. Lire impérativement [les règles d'importation du projet](../../importations.md) avant d'inspecter, d'ajouter ou de modifier des imports.
3. Lire les conventions générales dans [references/project-conventions.md](references/project-conventions.md).
4. Vérifier si le package possède `.agents/implementation.md` et appliquer ses conventions spécifiques.
5. Examiner les implémentations voisines ou analogues afin de comprendre la structure attendue.
6. Rechercher une implémentation ou un utilitaire existant avant d'en créer un nouveau.
7. Déterminer le domaine et le dossier auxquels appartient réellement l'implémentation.
8. Vérifier les dépendances nécessaires avant toute nouvelle importation.
9. Implémenter uniquement les changements nécessaires.
10. Mettre à jour les `index.ts` et les exports publics concernés.
11. Valider l'implémentation selon les commandes documentées dans `.agents/commands.md` du projet.
12. Lorsqu'un comportement est ajouté ou modifié, créer ou adapter les tests en suivant le skill `unit-tests`.

Les conventions documentées sont prioritaires sur les patterns éventuellement observés dans du code plus ancien.
