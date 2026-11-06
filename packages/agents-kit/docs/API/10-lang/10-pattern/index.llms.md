## DPattern

Sélectionner et traiter les variantes d’une union par identité, valeur littérale, motif structurel ou predicate, avec couverture exhaustive ou branche de repli.

### [DPattern.exhaustive](10-exhaustive.ts)

Terminer un traitement exhaustif en extrayant les valeurs des PatternResult.

### [DPattern.isMatch](10-isMatch.ts)

Vérifier un motif sur une valeur et affiner le type de la partie correspondante.

### [DPattern.match](10-match.ts)

Traiter une valeur selon un motif et conserver les cas qui ne correspondent pas.

### [DPattern.matchWithEntity](10-matchWithEntity.ts)

Router une union d’entités DuploJS vers un callback pour chaque nom d’entité.

### [DPattern.matchWithEntityOtherwise](10-matchWithEntityOtherwise.ts)

Router les entités sélectionnées et conserver dans le type du fallback les entités restantes.

### [DPattern.matchWithError](10-matchWithError.ts)

Traiter chaque variante d’une union d’erreurs DuploJS selon son identifiant typé.

### [DPattern.matchWithErrorOtherwise](10-matchWithErrorOtherwise.ts)

Traiter certains identifiants d’erreur et transmettre au fallback l’union d’erreurs non couverte.

### [DPattern.matchWithFact](10-matchWithFact.ts)

Router des facts par nom et exposer leur valeur ainsi que leur payload typé.

### [DPattern.matchWithFactOtherwise](10-matchWithFactOtherwise.ts)

Router les facts choisis et traiter les autres noms avec un callback recevant le fact restant.

### [DPattern.matchWithNumber](10-matchWithNumber.ts)

Associer chaque nombre littéral possible à un callback spécialisé pour cette valeur.

### [DPattern.matchWithNumberOtherwise](10-matchWithNumberOtherwise.ts)

Traiter certains nombres littéraux et recevoir les autres valeurs dans un fallback.

### [DPattern.matchWithString](10-matchWithString.ts)

Associer chaque chaîne littérale possible à un callback dont le paramètre est cette valeur exacte.

### [DPattern.matchWithStringOtherwise](10-matchWithStringOtherwise.ts)

Traiter certains littéraux de chaîne et transmettre au fallback l’union non couverte.

### [DPattern.matchWithTaggedObject](10-matchWithTaggedObject.ts)

Router une union d’objets marqués vers un callback par valeur de tag.

### [DPattern.matchWithTaggedObjectOtherwise](10-matchWithTaggedObjectOtherwise.ts)

Router les tags explicitement traités et transmettre les variantes restantes au fallback.

### [DPattern.otherwise](10-otherwise.ts)

Traiter la valeur non reconnue restante ou déballer un résultat déjà traité.

### [DPattern.union](10-union.ts)

Combiner plusieurs motifs en un seul motif correspondant à l’un d’eux.

### [DPattern.when](10-when.ts)

Exécuter un traitement lorsque le predicate correspond, en laissant la branche sinon inchangée.

### [DPattern.whenNot](10-whenNot.ts)

Exécuter un traitement pour les valeurs refusées par le predicate et laisser les autres non traitées.
