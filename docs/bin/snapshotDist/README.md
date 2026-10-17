# duplojs-snapshot-dist

Depuis la racine du monorepo, la commande interne prépare les arguments pour `v1` :

```sh
pnpm --filter docs snapshot:dist
```

Le script Bash `docs/.commands/snapshot-dist.sh` utilise des options fixes et se lance depuis le workspace
`docs`, où pnpm exécute automatiquement la commande. Les chemins `./libs/v1` et `../packages` sont relatifs
à ce workspace ; le script ne change pas le dossier courant et ne transmet aucun argument supplémentaire.
La CLI TypeScript conserve ses options pour les autres utilisations.

Les patterns sont relatifs à `rootDir`. Plusieurs patterns peuvent être séparés par des virgules,
par exemple `'lang/dist/,server/dist/'`. Les exclusions utilisent le préfixe `!`.
Les dossiers `node_modules` sont toujours ignorés, sans être parcourus.

Chaque dossier sélectionné est copié dans `output/<nom du dossier parent>/<nom du dossier sélectionné>`.
Par exemple, `packages/server/dist` devient `docs/libs/v1/server/dist`.
Tous les dossiers de packages cibles doivent déjà exister ; un dossier manquant provoque une erreur
indiquant son chemin avant la copie de ce package. Les packages précédents peuvent déjà avoir été copiés.
Une sélection vide provoque également une erreur.

Seuls les fichiers terminant par `.d.ts` sont copiés, avec leur arborescence et leur contenu d'origine.
Les liens symboliques sont ignorés. Les déclarations existantes sont écrasées ; les anciens fichiers
absents des sources ne sont pas supprimés. Les `package.json`, les dépendances et les imports
restent à gérer manuellement.
