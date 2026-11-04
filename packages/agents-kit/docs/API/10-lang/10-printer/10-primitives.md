### Constantes et types de DPrinter

Les constantes publiques fournissent les séparateurs textuels usuels, tandis que les types décrivent les couleurs et les valeurs acceptées par les fonctions de rendu.

---

Les constantes `back`, `dash` et `tab` valent respectivement `"\n"`, `"-"` et `"\t"`. Elles peuvent servir de séparateurs pour `render` ou pour assembler du texte dans d’autres traitements.

`Colors` est l’union des couleurs ANSI disponibles : `"red"`, `"green"`, `"yellow"`, `"blue"`, `"magenta"`, `"cyan"` et `"gray"`. Les fonctions `colorized` et `colorizedBold` utilisent cette union pour sélectionner leur couleur.

`RenderInput` décrit les valeurs acceptées par les fonctions de rendu : `string | boolean | null | undefined | readonly RenderInput[]`. Les tableaux peuvent contenir récursivement d’autres tableaux. À l’exécution, les tableaux imbriqués sont parcourus, `true` est rendu sous la forme `"true"`, tandis que `false`, `null` et `undefined` sont ignorés.
