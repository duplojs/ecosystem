## DArray

Opérations immuables de lecture, transformation, sélection, réduction et modification de tableaux, avec prise en compte de leurs contraintes de typage.

### [DArray.at](10-at.ts)

Lire l’élément situé à un index en reflétant dans le type la possibilité d’une absence.
 
### [DArray.chunk](10-chunk.ts)

Découper un tableau en sous-tableaux dont la taille ne dépasse pas la limite donnée.
 
### [DArray.coalescing](10-coalescing.ts)

Convertir une valeur en tableau sans ré-encapsuler une valeur déjà contenue dans un tableau.
 
### [DArray.concat](10-concat.ts)

Ajouter les éléments d’un ou plusieurs tableaux à la fin sans muter le tableau d’entrée.
 
### [DArray.copyWithin](10-copyWithin.ts)

Copier une portion d’un tableau vers une autre position dans une nouvelle copie.
 
### [DArray.every](10-every.ts)

Vérifier que tous les éléments d’un tableau satisfont un prédicat.
 
### [DArray.fill](10-fill.ts)

Remplacer une plage d’éléments par une valeur dans une nouvelle copie du tableau.
 
### [DArray.fillAll](10-fillAll.ts)

Remplacer tous les éléments d’un tableau par une même valeur dans une nouvelle copie.
 
### [DArray.filter](10-filter.ts)

Construire un nouveau tableau avec les éléments qui satisfont un prédicat.
 
### [DArray.find](10-find.ts)

Lire le premier élément satisfaisant un prédicat, ou undefined si aucun ne convient.
 
### [DArray.findAndReplace](10-findAndReplace.ts)

Remplacer le premier élément satisfaisant un prédicat dans une nouvelle copie, ou retourner undefined.
 
### [DArray.findAndSpliceDelete](10-findAndSpliceDelete.ts)

Supprimer plusieurs éléments à partir du premier élément satisfaisant un prédicat.
 
### [DArray.findAndSpliceInsert](10-findAndSpliceInsert.ts)

Insérer des éléments avant le premier élément satisfaisant un prédicat.
 
### [DArray.findAndSpliceReplace](10-findAndSpliceReplace.ts)

Remplacer la portion commençant au premier élément satisfaisant un prédicat.
 
### [DArray.findDuplicates](10-findDuplicates.ts)

Trouver les valeurs primitives ou temporelles apparaissant plusieurs fois dans un tableau.
 
### [DArray.findIndex](10-findIndex.ts)

Lire l’index du premier élément satisfaisant un prédicat, ou undefined.
 
### [DArray.findLast](10-findLast.ts)

Lire le dernier élément satisfaisant un prédicat, ou undefined si aucun ne convient.
 
### [DArray.findLastIndex](10-findLastIndex.ts)

Lire l’index du dernier élément satisfaisant un prédicat, ou undefined.
 
### [DArray.first](10-first.ts)

Lire le premier élément d’un tableau en conservant les garanties de son type.
 
### [DArray.flat](10-flat.ts)

Aplatir les niveaux imbriqués d’un tableau selon une profondeur donnée.
 
### [DArray.flatMap](10-flatMap.ts)

Transformer chaque élément puis aplatir le niveau de tableau produit.
 
### [DArray.from](10-from.ts)

Convertir une source array-like, itérable ou asynchrone en tableau.
 
### [DArray.group](10-group.ts)

Regrouper les valeurs produites par une fonction selon un nom de groupe.
 
### [DArray.groupOutput](10-groupOutput.ts)

Construire le résultat nommé attendu par DArray.group pour associer une valeur à un groupe.
 
### [DArray.includes](10-includes.ts)

Vérifier qu’un tableau contient une valeur.
 
### [DArray.indexOf](10-indexOf.ts)

Lire l’index de la première occurrence d’une valeur, ou undefined.
 
### [DArray.insert](10-insert.ts)

Ajouter une valeur à la fin d’un tableau dans une nouvelle copie.
 
### [DArray.is](10-is.ts)

Vérifier au runtime qu’une valeur est un tableau et affiner son type TypeScript.
 
### [DArray.isLastIndex](10-isLastIndex.ts)

Vérifier qu’un index désigne le dernier élément du tableau.
 
### [DArray.last](10-last.ts)

Lire le dernier élément d’un tableau en conservant les garanties de son type.
 
### [DArray.lastIndexOf](10-lastIndexOf.ts)

Lire l’index de la dernière occurrence d’une valeur, ou undefined.
 
### [DArray.length](10-length.ts)

Lire la longueur d’un tableau avec les contraintes de cardinalité présentes dans son type.
 
### [DArray.lengthEqual](10-lengthEqual.ts)

Vérifier qu’un tableau possède exactement un nombre donné d’éléments et établir cette contrainte.
 
### [DArray.map](10-map.ts)

Transformer chaque élément d’un tableau dans une nouvelle collection.
 
### [DArray.maxElements](10-maxElements.ts)

Vérifier qu’un tableau contient au plus un nombre donné d’éléments et établir cette contrainte.
 
### [DArray.minElements](10-minElements.ts)

Vérifier qu’un tableau contient au moins un nombre donné d’éléments et établir cette contrainte.
 
### [DArray.notIncludes](10-notIncludes.ts)

Vérifier qu’un tableau ne contient pas une valeur.
 
### [DArray.pop](10-pop.ts)

Retirer le dernier élément d’un tableau dans une nouvelle copie.
 
### [DArray.prepend](10-prepend.ts)

Ajouter les éléments d’un ou plusieurs tableaux au début sans muter le tableau d’entrée.
 
### [DArray.push](10-push.ts)

Ajouter une ou plusieurs valeurs à la fin d’un tableau dans une nouvelle copie.
 
### [DArray.reduce](10-reduce.ts)

Réduire un tableau avec un accumulateur explicite et les sorties next ou exit.
 
### [DArray.reduceFrom](10-reduceFrom.ts)

Marquer explicitement la valeur initiale d’un reduce pour préserver sa forme de valeur.
 
### [DArray.reduceRight](10-reduceRight.ts)

Réduire un tableau de droite à gauche avec le contrat explicite de DArray.reduce.
 
### [DArray.reverse](10-reverse.ts)

Inverser l’ordre d’un tableau dans une nouvelle copie.
 
### [DArray.select](10-select.ts)

Transformer sélectivement les éléments avec select et ignorer les autres avec skip.
 
### [DArray.set](10-set.ts)

Remplacer la valeur à un index dans une nouvelle copie du tableau.
 
### [DArray.shift](10-shift.ts)

Retirer le premier élément d’un tableau dans une nouvelle copie.
 
### [DArray.slice](10-slice.ts)

Extraire une portion d’un tableau dans une nouvelle collection.
 
### [DArray.some](10-some.ts)

Vérifier qu’au moins un élément d’un tableau satisfait un prédicat.
 
### [DArray.sort](10-sort.ts)

Trier une copie du tableau avec une fonction de comparaison.
 
### [DArray.spliceDelete](10-spliceDelete.ts)

Supprimer une portion d’un tableau dans une nouvelle copie.
 
### [DArray.spliceInsert](10-spliceInsert.ts)

Insérer des éléments à un index dans une nouvelle copie.
 
### [DArray.spliceReplace](10-spliceReplace.ts)

Remplacer une portion d’un tableau dans une nouvelle copie.
 
### [DArray.unshift](10-unshift.ts)

Ajouter une ou plusieurs valeurs au début d’un tableau dans une nouvelle copie.
 
