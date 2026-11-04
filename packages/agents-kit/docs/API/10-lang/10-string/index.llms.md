# DString

Fonctions de manipulation, recherche, validation et transformation des chaînes de caractères, avec des formes curifiées et des contraintes de typage lorsque l'API peut les établir.

### [DString.at](10-at.ts)

Lire le caractère situé à un index, avec `undefined` lorsque l'index est hors limites.
 
### [DString.capitalize](10-capitalize.ts)

Mettre en majuscule le premier caractère d'une chaîne.
 
### [DString.charAt](10-charAt.ts)

Lire le caractère situé à un index positif ou nul.
 
### [DString.concat](10-concat.ts)

Ajouter une ou plusieurs chaînes à la fin d'une chaîne.
 
### [DString.endsWith](10-endsWith.ts)

Tester si une chaîne se termine par une sous-chaîne.
 
### [DString.extract](10-extract.ts)

Extraire la première occurrence d'un motif avec ses groupes et sa position.
 
### [DString.extractAll](10-extractAll.ts)

Produire les occurrences d'un motif global sous forme de génératrice.
 
### [DString.first](10-first.ts)

Lire le premier caractère d'une chaîne.
 
### [DString.includes](10-includes.ts)

Tester si une chaîne contient une sous-chaîne.
 
### [DString.indexOf](10-indexOf.ts)

Retourner la position d'une sous-chaîne, ou `undefined` si elle est absente.
 
### [DString.isComposedOf](10-isComposedOf.ts)

Vérifier qu'une chaîne ne contient que des caractères appartenant à une ou plusieurs plages.
 
### [DString.isEmail](10-isEmail.ts)

Vérifier qu'une chaîne respecte le format d'une adresse e-mail.
 
### [DString.isIn](10-isIn.ts)

Vérifier qu'une chaîne appartient à une collection de valeurs autorisées.
 
### [DString.isKeyof](10-isKeyof.ts)

Vérifier qu'une valeur est une clé de l'objet fourni et affiner son type.
 
### [DString.isNotEmpty](10-isNotEmpty.ts)

Vérifier qu'une chaîne contient au moins un caractère.
 
### [DString.isNumber](10-isNumber.ts)

Vérifier qu'une chaîne représente un nombre et établir cette contrainte dans le type.
 
### [DString.isTrimmed](10-isTrimmed.ts)

Vérifier qu'une chaîne ne possède pas d'espace superflu à ses extrémités.
 
### [DString.isUrl](10-isUrl.ts)

Vérifier qu'une chaîne est une URL valide.
 
### [DString.isUuid](10-isUuid.ts)

Vérifier qu'une chaîne respecte le format UUID pris en charge.
 
### [DString.join](10-join.ts)

Réunir les chaînes d'une collection avec un séparateur.
 
### [DString.last](10-last.ts)

Lire le dernier caractère d'une chaîne.
 
### [DString.lastIndexOf](10-lastIndexOf.ts)

Retourner la dernière position d'une sous-chaîne, ou `undefined` si elle est absente.
 
### [DString.length](10-length.ts)

Retourner le nombre de caractères d'une chaîne.
 
### [DString.lengthEqual](10-lengthEqual.ts)

Tester ou établir qu'une chaîne possède exactement un nombre donné de caractères.
 
### [DString.maxCharacters](10-maxCharacters.ts)

Tester ou établir une longueur maximale pour une chaîne.
 
### [DString.minCharacters](10-minCharacters.ts)

Tester ou établir une longueur minimale pour une chaîne.
 
### [DString.normalize](10-normalize.ts)

Normaliser une chaîne selon une forme Unicode.
 
### [DString.padEnd](10-padEnd.ts)

Compléter une chaîne par la droite jusqu'à une longueur cible.
 
### [DString.padStart](10-padStart.ts)

Compléter une chaîne par la gauche jusqu'à une longueur cible.
 
### [DString.pop](10-pop.ts)

Retirer le dernier caractère d'une chaîne.
 
### [DString.prepend](10-prepend.ts)

Ajouter une ou plusieurs chaînes au début d'une chaîne.
 
### [DString.repeat](10-repeat.ts)

Répéter une chaîne un nombre positif de fois.
 
### [DString.replace](10-replace.ts)

Remplacer la première occurrence d'un motif par une chaîne ou une fonction de remplacement.
 
### [DString.replaceAll](10-replaceAll.ts)

Remplacer toutes les occurrences d'un motif par une chaîne ou une fonction de remplacement.
 
### [DString.search](10-search.ts)

Retourner la position d'un motif, ou `undefined` lorsqu'il ne correspond pas.
 
### [DString.shift](10-shift.ts)

Retirer le premier caractère d'une chaîne.
 
### [DString.slice](10-slice.ts)

Extraire une portion d'une chaîne entre deux index.
 
### [DString.sort](10-sort.ts)

Trier une copie d'une collection de chaînes dans l'ordre croissant ou décroissant.
 
### [DString.sortCompare](10-sortCompare.ts)

Comparer deux chaînes avec l'ordre de tri du domaine String.
 
### [DString.split](10-split.ts)

Découper une chaîne selon un séparateur, avec une limite facultative.
 
### [DString.startsWith](10-startsWith.ts)

Tester si une chaîne commence par une sous-chaîne.
 
### [DString.stringify](10-stringify.ts)

Convertir une valeur quelconque en représentation textuelle sans laisser `undefined` au résultat.
 
### [DString.substring](10-substring.ts)

Extraire une sous-chaîne selon les règles de `substring`.
 
### [DString.test](10-test.ts)

Tester une chaîne avec une expression régulière.
 
### [DString.to](10-to.ts)

Convertir une valeur stringifiable en chaîne en conservant les littéraux connus lorsque c'est possible.
 
### [DString.toLowerCase](10-toLowerCase.ts)

Convertir une chaîne en minuscules.
 
### [DString.toUpperCase](10-toUpperCase.ts)

Convertir une chaîne en majuscules.
 
### [DString.trim](10-trim.ts)

Supprimer les espaces au début et à la fin d'une chaîne.
 
### [DString.trimEnd](10-trimEnd.ts)

Supprimer les espaces à la fin d'une chaîne.
 
### [DString.trimStart](10-trimStart.ts)

Supprimer les espaces au début d'une chaîne.
 
### [DString.uncapitalize](10-uncapitalize.ts)

Mettre en minuscule le premier caractère d'une chaîne.
 
