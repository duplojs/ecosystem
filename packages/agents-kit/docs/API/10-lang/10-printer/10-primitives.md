### Constantes et types de DPrinter

Les enums publiques sélectionnent les fins de ligne et les unités d'indentation, tandis que les types décrivent les paramètres et les valeurs acceptées par les fonctions de rendu.

---

`Indent` est une enum créée avec `DCommon.createEnum`, qui propose `tab`, `space1`, `space2`, `space3` et `space4`. `Back` propose `LF` et `CRLF`. Les types du même nom représentent leurs valeurs respectives. Ces enums ne produisent pas de texte : leur interprétation appartient aux fonctions de rendu.

`RenderLineParams` expose un `joinCharacter` optionnel, égal à une espace par défaut. `RenderParagraphParams` expose un `back` optionnel, égal à `Back.LF` par défaut ; le séparateur du paragraphe est exclusivement cette fin de ligne.

Les deux fonctions acceptent un `indent` optionnel, sélectionné avec `Indent`, et un `indentLevel` optionnel, égal à `0` par défaut. Sans type ou sans quantité, aucune indentation n'est ajoutée. La quantité multiplie l'unité choisie : `Indent.space2` avec `indentLevel: 3` produit six espaces. Les quantités négatives ou non finies désactivent l'indentation ; les fractions positives sont tronquées.

`renderLine` préfixe uniquement le début du texte assemblé. `renderParagraph` préfixe chaque ligne, y compris celles déjà présentes dans les chaînes d'entrée, en préservant leurs fins de ligne. Un tableau sans valeur rendable produit toujours une chaîne vide.

La constante `dash` vaut `"-"`.

`Colors` est l’union des couleurs ANSI disponibles : `"red"`, `"green"`, `"yellow"`, `"blue"`, `"magenta"`, `"cyan"` et `"gray"`. Les fonctions `colorized` et `colorizedBold` utilisent cette union pour sélectionner leur couleur.

`RenderInput` décrit les valeurs acceptées par les fonctions de rendu : `string | boolean | null | undefined | readonly RenderInput[]`. Les tableaux peuvent contenir récursivement d’autres tableaux. À l’exécution, les tableaux imbriqués sont parcourus, `true` est rendu sous la forme `"true"`, tandis que `false`, `null` et `undefined` sont ignorés.
