---
name: unit-tests
description: >
  Créer, modifier ou corriger des tests unitaires dans le 
  monorepo DuploJS, notamment pour tester un comportement, 
  ajouter des cas de test ou améliorer la couverture.
---

## Principes

Les tests unitaires doivent vérifier que l'exécution respecte l'intention du code.

L'intention n'est pas toujours explicitement documentée. Lorsqu'elle peut être déduite du typage, la déclaration de type doit être considérée comme la référence principale du comportement attendu.

Les tests doivent donc être écrits à partir de l'intention exprimée par les types et non simplement reproduire le comportement observé à l'exécution.

Si une incohérence est constatée ou suspectée entre le typage et le comportement réel :

* ne pas modifier le code pour faire passer les tests ;
* ne pas adapter les tests au comportement observé ;
* conserver l'état actuel du code ;
* signaler explicitement l'incohérence au développeur.

L'objectif minimal est d'obtenir **100 % de couverture**. La couverture permet de vérifier que l'ensemble des chemins d'exécution pertinents a été exercé, mais elle ne garantit pas à elle seule la qualité des tests.

Les tests doivent également couvrir les garanties apportées par le typage. Certains cas peuvent donc être ajoutés principalement pour vérifier une contrainte ou un comportement de type, même lorsqu'ils semblent redondants du point de vue de l'exécution.

La couverture d'exécution est un minimum. La référence reste l'intention exprimée par l'API et son typage.

## Périmètre des tests unitaires

Un test unitaire doit être pensé **exclusivement dans le périmètre du package courant**.

Même si le projet est organisé en monorepo, la création ou la modification d'un test unitaire ne doit jamais dépendre du comportement, de l'implémentation ou des tests d'un autre package de l'écosystème.

Chaque intervention sur les tests unitaires doit donc être raisonnée uniquement à partir :

* du module actuellement testé ;
* de son API ;
* de son typage ;
* de son comportement attendu.

Les interactions avec des éléments extérieurs au package ne doivent pas élargir le périmètre du test unitaire. Les comportements impliquant réellement plusieurs packages relèvent des tests d'intégration, pas des tests unitaires.


## Outils et exécution

Les tests unitaires utilisent **Vitest** configuré en mode workspace.

Chaque package possède sa propre configuration Vitest et déclare son propre projet de test. L'exécution est néanmoins centralisée au niveau de l'écosystème : les tests doivent être lancés à travers les commandes prévues par le monorepo, et non directement depuis la configuration locale d'un package.

Vitest est configuré pour exposer ses API globalement. Les tests peuvent donc utiliser directement les primitives de test disponibles sans les importer explicitement.

Le contexte TypeScript utilisé par les tests est également dédié à cet usage : chaque package possède un `tsconfig.test.json` qui enrichit son contexte de développement avec les fichiers et les types nécessaires aux tests.

Lors de l'écriture ou de la modification d'un test, utiliser l'infrastructure déjà définie par le package et par le workspace. Ne pas introduire une configuration Vitest ou TypeScript parallèle lorsque l'existant permet déjà d'exprimer le test.

## Organisation des fichiers de test

Chaque package possède un dossier `tests/` contenant l'ensemble de ses tests unitaires.

L'arborescence de `tests/` doit rester **isomorphe** à celle du dossier `scripts/` du même package. Un fichier de test doit donc se trouver à l'emplacement correspondant au fichier source qu'il couvre.

Sauf exception justifiée :

* un fichier source correspond à un fichier de test ;
* tous les tests relatifs à ce fichier source restent regroupés dans ce même fichier de test, même si le fichier source expose plusieurs fonctions ;
* le fichier de test reprend le nom du fichier source avec le suffixe `.test`.

Exemple :

```text
scripts/
└── object/
    └── merge.ts

tests/
└── object/
    └── merge.test.ts
```

Éviter de répartir les tests d'un même fichier source dans plusieurs fichiers lorsque cela n'est pas nécessaire.
