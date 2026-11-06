## DPath

Chemins Unix typés : déclarer des littéraux, valider et normaliser des chaînes runtime, extraire des segments, résoudre des chemins ou sélectionner des motifs glob, indépendamment du système de fichiers.

### [DPath.computeRelative](10-computeRelative.ts)

Calculer le chemin relatif entre deux chemins absolus.
 
### [DPath.concatSegment](10-concatSegment.ts)

Assembler un segment avec un ou plusieurs autres segments.
 
### [DPath.create](10-create.ts)

Normaliser une chaîne et retourner un Either selon qu’elle forme un chemin valide.
 
### [DPath.createAbsolute](10-createAbsolute.ts)

Normaliser une chaîne et vérifier qu’elle représente un chemin absolu.
 
### [DPath.createAbsoluteOrThrow](10-createAbsoluteOrThrow.ts)

Normaliser un chemin absolu ou lever une erreur si l’entrée est invalide.
 
### [DPath.createMatcher](10-createMatcher.ts)

Créer un predicate de chemin à partir de motifs glob positifs et négatifs.
 
### [DPath.createOrThrow](10-createOrThrow.ts)

Normaliser un chemin ou lever une erreur si l’entrée est invalide.
 
### [DPath.createSegment](10-createSegment.ts)

Normaliser une chaîne et vérifier qu’elle ne contient qu’un segment.
 
### [DPath.createSegmentOrThrow](10-createSegmentOrThrow.ts)

Normaliser un segment ou lever une erreur si l’entrée n’est pas un segment valide.
 
### [DPath.declareAbsolutePath](10-declareAbsolutePath.ts)

Déclarer un littéral de chemin comme chemin absolu après vérification statique.
 
### [DPath.declarePath](10-declarePath.ts)

Déclarer un littéral valide comme chemin après vérification statique.
 
### [DPath.declareSegment](10-declareSegment.ts)

Déclarer un littéral valide comme segment après vérification statique.
 
### [DPath.getBaseName](10-getBaseName.ts)

Lire le dernier segment d’un chemin, avec la possibilité d’en retirer l’extension.
 
### [DPath.getExtensionName](10-getExtensionName.ts)

Lire l’extension du dernier segment, avec la possibilité de conserver le point.
 
### [DPath.getParentFolderPath](10-getParentFolderPath.ts)

Lire le dossier parent d’un chemin en conservant son caractère absolu lorsqu’il est connu.
 
### [DPath.is](10-is.ts)

Vérifier qu’une chaîne respecte la syntaxe d’un chemin et affiner son type.
 
### [DPath.isAbsolute](10-isAbsolute.ts)

Vérifier qu’une chaîne est un chemin absolu et affiner son type.
 
### [DPath.isSegment](10-isSegment.ts)

Vérifier qu’une chaîne est un segment unique et affiner son type.
 
### [DPath.normalize](10-normalize.ts)

Réduire les séparateurs et les segments relatifs d’un chemin.
 
### [DPath.resolveFrom](10-resolveFrom.ts)

Résoudre des segments depuis une origine absolue, avec une option pour la conserver.
 
### [DPath.resolveRelative](10-resolveRelative.ts)

Résoudre une suite de chemins relatifs ou absolus en un seul chemin normalisé.
 
