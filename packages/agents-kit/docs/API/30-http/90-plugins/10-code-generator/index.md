# CodeGenerator

Générer les types des routes pour un client HTTP et partager des modules avec Rolldown.

---

Les deux configurations décrivent un projet avec cette disposition :

```text
project/
├── core/
│   ├── tsconfig.json
│   ├── routes/          # routes incluses par le tsconfig
│   └── domains/         # exports TypeScript à partager
└── contracts/
    ├── rolldown.routes.config.ts
    └── rolldown.slices.config.ts
```

Installer Rolldown, `rolldown-plugin-dts`, TypeScript, `@duplojs/http`, `@duplojs/tools`, `@duplojs/lang` et `@duplojs/server` dans le projet de build. Depuis `contracts/`, exécuter les deux commandes indiquées dans les exemples. Le `tsconfig` du serveur doit résoudre ses imports et inclure les fichiers de routes. Les chemins de configuration sont relatifs au répertoire courant ; les motifs de routes sélectionnent les chemins du programme TypeScript, tandis que les motifs de slices sont relatifs à `workDirectory`.

La première commande produit `routesTypes.generate/routes.d.ts`. La seconde produit les modules JavaScript et déclarations de `slices.generate/`. Publier ces sorties dans un package de contrats, par exemple avec `./routes` pointant vers `routesTypes.generate/routes.d.ts` pour les types et `.` vers `slices.generate/index.js` et `index.d.ts`. Inclure les dépendances utilisées par les déclarations et les modules ; `external` laisse les packages DuploJS externes au bundle. Construire ce package avant le client. Ne pas placer les sources serveur privées dans une slice destinée au client : une slice réexporte les fichiers correspondant au motif.

La [fixture de déclaration](fixtures/routes.d.ts) est une copie de la sortie réelle du test d’intégration HTTP : elle conserve les déclarations de routes et l’union `Routes`, avant leur transformation en contrats utilisables par le client.
