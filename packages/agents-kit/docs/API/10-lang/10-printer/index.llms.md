## DPrinter

Fonctions et constantes pour assembler du texte, formater des lignes et paragraphes, ajouter une indentation ou des styles ANSI.

### [Constantes et types de DPrinter](10-primitives.md)

Les constantes publiques fournissent les séparateurs textuels usuels, tandis que les types décrivent les couleurs et les valeurs acceptées par les fonctions de rendu.


### [DPrinter.bold](10-bold.ts)

Encadrer une chaîne par les codes ANSI de mise en gras.

### [DPrinter.colorized](10-colorized.ts)

Encadrer une chaîne par les codes ANSI d’une couleur sélectionnée.

### [DPrinter.colorizedBold](10-colorizedBold.ts)

Appliquer une couleur ANSI et le style gras à une chaîne.

### [DPrinter.indent](10-indent.ts)

Produire une chaîne contenant le nombre demandé de tabulations.

### [DPrinter.render](10-render.ts)

Assembler récursivement des valeurs rendables avec un séparateur choisi.

### [DPrinter.renderLine](10-renderLine.ts)

Assembler récursivement des valeurs en séparant les éléments par une espace.

### [DPrinter.renderParagraph](10-renderParagraph.ts)

Assembler récursivement des valeurs en séparant les éléments par un saut de ligne.
