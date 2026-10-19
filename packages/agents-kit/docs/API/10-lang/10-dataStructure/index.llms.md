## DDataStructure

Construction de contrats de données validables au runtime, composables et reflétés dans les types TypeScript.

### [DDataStructure.absolutePath](10-absolutePath.ts)

Construire une contrainte de chemin absolu et l’appliquer à une structure de chaîne.
 
### [DDataStructure.allowedCharacters](10-allowedCharacters.ts)

Construire une contrainte de caractères autorisés et l’appliquer à une structure de chaîne.
 
### [DDataStructure.array](10-array.ts)

Construire une structure de tableau à partir de la structure de ses éléments.
 
### [DDataStructure.arrayLengthEqual](10-arrayLengthEqual.ts)

Construire une contrainte de longueur exacte et l’appliquer à une structure de tableau.
 
### [DDataStructure.betweenThan](10-betweenThan.ts)

Construire une contrainte de nombre strictement compris entre deux bornes.
 
### [DDataStructure.betweenThanOrEqual](10-betweenThanOrEqual.ts)

Construire une contrainte de nombre compris entre deux bornes inclusives.
 
### [DDataStructure.bigint](10-bigint.ts)

Construire une structure représentant des valeurs `bigint`.
 
### [DDataStructure.boolean](10-boolean.ts)

Construire une structure représentant des valeurs booléennes.
 
### [DDataStructure.createCodec](10-createCodec.ts)

Définir la conversion entre la valeur interne d’un type fondamental et sa représentation encodée.
 
### [DDataStructure.createCodecs](10-createCodecs.ts)

Regrouper des codecs dans un contexte indexé par leurs types fondamentaux.
 
### [DDataStructure.createErrorInterpreter](10-createErrorInterpreter.ts)

Transformer les issues d’une erreur de validation ou de codec en messages interprétables.
 
### [DDataStructure.date](10-date.ts)

Construire une structure représentant les dates DuploJS.
 
### [DDataStructure.email](10-email.ts)

Construire une contrainte d’adresse email et l’appliquer à une structure de chaîne.
 
### [DDataStructure.endsWith](10-endsWith.ts)

Construire une contrainte de suffixe et l’appliquer à une structure de chaîne.
 
### [DDataStructure.even](10-even.ts)

Construire une contrainte de nombre pair et l’appliquer à une structure numérique.
 
### [DDataStructure.extend](10-extend.ts)

Étendre une structure objet en ajoutant ou en remplaçant des propriétés.
 
### [DDataStructure.greaterThan](10-greaterThan.ts)

Construire une contrainte de nombre supérieur à un seuil.
 
### [DDataStructure.greaterThanOrEqual](10-greaterThanOrEqual.ts)

Construire une contrainte de nombre supérieur ou égal à un seuil.
 
### [DDataStructure.include](10-include.ts)

Construire une contrainte d’inclusion et l’appliquer à une structure de chaîne.
 
### [DDataStructure.integer](10-integer.ts)

Construire une contrainte de nombre entier et l’appliquer à une structure numérique.
 
### [DDataStructure.isNullStructure](10-isNullStructure.ts)

Vérifier qu’une structure représente exactement le type `null`.
 
### [DDataStructure.isNullable](10-isNullable.ts)

Vérifier qu’une structure accepte la valeur `null`.
 
### [DDataStructure.isOptional](10-isOptional.ts)

Vérifier qu’une structure accepte la valeur `undefined`.
 
### [DDataStructure.isUndefinedStructure](10-isUndefinedStructure.ts)

Vérifier qu’une structure représente exactement le type `undefined`.
 
### [DDataStructure.lazy](10-lazy.ts)

Construire une structure dont la résolution est différée.
 
### [DDataStructure.lessThan](10-lessThan.ts)

Construire une contrainte de nombre inférieur à un seuil.
 
### [DDataStructure.lessThanOrEqual](10-lessThanOrEqual.ts)

Construire une contrainte de nombre inférieur ou égal à un seuil.
 
### [DDataStructure.literal](10-literal.ts)

Construire une structure représentant une ou plusieurs valeurs littérales.
 
### [DDataStructure.maxCharacters](10-maxCharacters.ts)

Construire une contrainte de longueur maximale pour une chaîne.
 
### [DDataStructure.maxElements](10-maxElements.ts)

Construire une contrainte de cardinalité maximale pour un tableau.
 
### [DDataStructure.minCharacters](10-minCharacters.ts)

Construire une contrainte de longueur minimale pour une chaîne.
 
### [DDataStructure.minElements](10-minElements.ts)

Construire une contrainte de cardinalité minimale pour un tableau.
 
### [DDataStructure.multipleOf](10-multipleOf.ts)

Construire une contrainte de multiple numérique.
 
### [DDataStructure.negative](10-negative.ts)

Construire une contrainte de nombre négatif ou nul.
 
### [DDataStructure.notEmpty](10-notEmpty.ts)

Construire une contrainte qui refuse les chaînes vides.
 
### [DDataStructure.notZero](10-notZero.ts)

Construire une contrainte qui refuse zéro.
 
### [DDataStructure.null](10-null.ts)

Construire une structure représentant la valeur `null`.
 
### [DDataStructure.nullable](10-nullable.ts)

Ajouter `null` aux valeurs acceptées par une structure.
 
### [DDataStructure.number](10-number.ts)

Construire une structure représentant des nombres.
 
### [DDataStructure.numberInString](10-numberInString.ts)

Construire une contrainte qui exige qu’une chaîne représente un nombre.
 
### [DDataStructure.object](10-object.ts)

Construire une structure objet à partir d’une forme de propriétés.
 
### [DDataStructure.odd](10-odd.ts)

Construire une contrainte de nombre impair.
 
### [DDataStructure.optional](10-optional.ts)

Ajouter `undefined` aux valeurs acceptées par une structure.
 
### [DDataStructure.partial](10-partial.ts)

Rendre optionnelles toutes les propriétés d’une structure objet.
 
### [DDataStructure.path](10-path.ts)

Construire une contrainte qui exige une chaîne représentant un chemin.
 
### [DDataStructure.positive](10-positive.ts)

Construire une contrainte de nombre positif ou nul.
 
### [DDataStructure.record](10-record.ts)

Construire une structure d’objet dont les clés et les valeurs sont structurées.
 
### [DDataStructure.refine](10-refine.ts)

Construire une contrainte personnalisée à partir d’un predicate DuploJS.
 
### [DDataStructure.regex](10-regex.ts)

Construire une contrainte de correspondance avec une expression régulière.
 
### [DDataStructure.required](10-required.ts)

Rendre obligatoires les propriétés d’une structure objet qui peuvent être `undefined`.
 
### [DDataStructure.safe](10-safe.ts)

Construire une contrainte d’entier sûr JavaScript.
 
### [DDataStructure.segmentPath](10-segmentPath.ts)

Construire une contrainte qui exige un segment de chemin.
 
### [DDataStructure.startsWith](10-startsWith.ts)

Construire une contrainte de préfixe et l’appliquer à une structure de chaîne.
 
### [DDataStructure.strictNegative](10-strictNegative.ts)

Construire une contrainte de nombre strictement négatif.
 
### [DDataStructure.strictPositive](10-strictPositive.ts)

Construire une contrainte de nombre strictement positif.
 
### [DDataStructure.string](10-string.ts)

Construire une structure représentant des chaînes de caractères.
 
### [DDataStructure.stringLengthEqual](10-stringLengthEqual.ts)

Construire une contrainte de longueur exacte pour une chaîne.
 
### [DDataStructure.time](10-time.ts)

Construire une structure représentant les heures DuploJS.
 
### [DDataStructure.trimmed](10-trimmed.ts)

Construire une contrainte de chaîne sans espaces périphériques.
 
### [DDataStructure.typeStructureIdentifier](10-typeStructureIdentifier.ts)

Identifier une structure de type et affiner son type TypeScript.
 
### [DDataStructure.undefined](10-undefined.ts)

Construire une structure représentant la valeur `undefined`.
 
### [DDataStructure.union](10-union.ts)

Construire une structure qui accepte plusieurs structures alternatives.
 
### [DDataStructure.unwrapLazy](10-unwrapLazy.ts)

Résoudre une structure lazy et retourner la structure qu’elle contient.
 
### [DDataStructure.url](10-url.ts)

Construire une contrainte d’URL valide.
 
### [DDataStructure.uuid](10-uuid.ts)

Construire une contrainte d’UUID valide.
 
