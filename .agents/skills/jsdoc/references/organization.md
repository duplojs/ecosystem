# Organisation des fichiers JSDoc

Chaque package documente ses fonctions dans un dossier `jsDoc/` place a la racine du package.

L'arborescence de `jsDoc/` doit suivre celle de `scripts/`.

```text
scripts/
`-- array/
    `-- map.ts

jsDoc/
`-- array/
    `-- map/
        |-- index.md
        `-- example.ts
```

## Correspondance avec `scripts/`

Pour un fichier source qui expose une seule fonction principale, creer un dossier portant le nom du fichier source sans extension.

```text
scripts/array/map.ts
jsDoc/array/map/index.md
jsDoc/array/map/example.ts
```

Pour un fichier source qui expose plusieurs fonctions publiques, creer un dossier portant le nom du fichier source, puis un sous-dossier par fonction documentee.

```text
scripts/array/splice.ts
jsDoc/array/splice/delete/index.md
jsDoc/array/splice/delete/example.ts
jsDoc/array/splice/insert/index.md
jsDoc/array/splice/insert/example.ts
```

Adapter le nom du sous-dossier au nom public de la fonction. Le nom doit rester stable, lisible et proche de l'API exposee.

## Commentaire dans le code source

Le commentaire source doit contenir l'include principal et rester proche de la declaration publique concernee.

```ts
/**
 * {@include array/map/index.md}
 */
export function map(/* ... */): unknown;
```

Si plusieurs overloads documentent la meme fonction, placer le commentaire sur la premiere declaration publique de cette fonction.

Si un fichier contient plusieurs fonctions publiques, chaque fonction documentee doit avoir son propre commentaire `{@include ...}`.

## Chemins d'include

Les chemins utilises dans les balises `{@include ...}` sont relatifs au `includedPath` configure pour `@duplojs/unplugin-jsdoc-include`. Dans les packages DuploJS, ce chemin doit correspondre au dossier `jsDoc/` du package.

Utiliser donc des chemins relatifs a `jsDoc/` :

```md
{@include array/map/index.md}
{@include array/map/example.ts[3,14]}
```

Ne pas prefixer les chemins par `./jsDoc/` si le plugin est configure avec `includedPath` sur `jsDoc/`.

## Plugin de build

`@duplojs/unplugin-jsdoc-include` est un plugin `unplugin` compatible Rollup, Rolldown et Vite.

Il doit s'executer apres les autres plugins de generation, notamment apres `unplugin-dts`, afin de remplacer les includes dans les fichiers generes. Son implementation utilise `enforce: "post"`.

Verifier la configuration de build du package lorsque les includes ne sont pas encore resolus. Avec Rolldown, le plugin attendu ressemble a :

```ts
import jsdocInclude from "@duplojs/unplugin-jsdoc-include/rolldown";
import * as DPath from "@duplojs/lang/path";

const includedPath = DPath.createOrThrow(`${import.meta.dirname}/jsDoc`);

export default defineConfig({
	plugins: [
		dts(/* ... */),
		jsdocInclude({
			includedPath,
		}),
	],
});
```

Ne pas ajouter cette configuration sans verifier que la dependance est disponible et que le package doit bien generer la documentation par ce mecanisme.
