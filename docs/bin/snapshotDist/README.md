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
Les dossiers de destination sont créés automatiquement, y compris le dossier de version.
Une sélection vide provoque une erreur.

Seuls les fichiers terminant par `.d.ts` sont copiés, avec leur arborescence et leur contenu d'origine.
Les liens symboliques sont ignorés. Les déclarations existantes sont écrasées ; les anciens fichiers
absents des sources ne sont pas supprimés.

Le `package.json` situé à côté de chaque dossier source est lu pour régénérer intégralement le manifeste
du snapshot. Celui-ci contient uniquement `name`, `private: true`, `type: "module"`, `types` lorsqu'il est
présent, les `exports` de déclarations et `dependencies`. Pour chaque sous-chemin, le champ `types`
ou le chemin direct vers un `.d.ts` est conservé lorsqu'il correspond aux fichiers copiés.
Les patterns de chemins sont acceptés. Les autres exports sont écartés.

Le nom du dernier dossier de `output` définit le namespace : `./libs/v2` transforme `@duplojs/server`
en `@duplojs-v2/server`, ainsi que les noms de ses dépendances internes. Les contraintes de version
restent inchangées. Les dépendances externes conservent leur nom.

Les `dependencies` et `peerDependencies` sources sont fusionnées dans `dependencies` (la contrainte
de `dependencies` est prioritaire en cas de doublon). Les `devDependencies` sont ignorées.
Les types de plateforme sont fournis par le workspace `docs`, qui configure déjà `web` et `node`.

Les imports dans les déclarations gardent leur contenu d'origine. La configuration du consommateur
doit donc assurer la résolution des noms originaux vers les packages de la version choisie.
