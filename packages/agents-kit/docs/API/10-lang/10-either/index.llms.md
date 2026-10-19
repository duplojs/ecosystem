## DEither

Création, discrimination, transformation et propagation des réussites ou des échecs représentés par `Either`.

### [DEither.asyncGroup](10-asyncGroup.ts)

Regrouper séquentiellement des résultats synchrones ou asynchrones dans un Success.
 
### [DEither.asyncSafeCallback](10-asyncSafeCallback.ts)

Convertir une callback ou une promesse et ses exceptions en résultat asynchrone.
 
### [DEither.error](10-error.ts)

Créer un Left standardisé avec l’information `error`.
 
### [DEither.expect](10-expect.ts)

Retourner un Either sans modifier sa valeur ni son type.
 
### [DEither.fail](10-fail.ts)

Créer un Left standardisé représentant un échec sans valeur.
 
### [DEither.forwardAssertsSelection](10-forwardAssertsSelection.ts)

Affirmer qu’une information est sélectionnée et lever une exception sinon.
 
### [DEither.group](10-group.ts)

Regrouper des Right dans un Success en arrêtant au premier Left.
 
### [DEither.hasInformation](10-hasInformation.ts)

Tester l’information d’un Either et affiner le statut et la valeur.
 
### [DEither.isLeft](10-isLeft.ts)

Vérifier le statut Left et affiner le type de la valeur.
 
### [DEither.isRight](10-isRight.ts)

Vérifier le statut Right et affiner le type de la valeur.
 
### [DEither.isSelected](10-isSelected.ts)

Tester une sélection d’informations et affiner l’union d’Either.
 
### [DEither.keepAsRightByInformation](10-keepAsRightByInformation.ts)

Reclasser comme Right les variantes portant certaines informations.
 
### [DEither.keepAsRightSelection](10-keepAsRightSelection.ts)

Reclasser les variantes selon une sélection exhaustive d’informations.
 
### [DEither.left](10-left.ts)

Créer un résultat Left avec une information et une valeur optionnelle.
 
### [DEither.matchInformation](10-matchInformation.ts)

Appliquer exhaustivement une callback selon l’information du résultat.
 
### [DEither.matchInformationOtherwise](10-matchInformationOtherwise.ts)

Appliquer une callback pour certaines informations et une branche de repli pour les autres.
 
### [DEither.none](10-none.ts)

Créer le Left représentant l’absence d’une valeur.
 
### [DEither.ok](10-ok.ts)

Créer un Right standardisé représentant une réussite sans valeur.
 
### [DEither.result](10-result.ts)

Créer un état contextualisé de type Result, sans lui attribuer un succès ou un échec.
 
### [DEither.rewriteInformation](10-rewriteInformation.ts)

Renommer certaines informations en conservant le statut et la valeur.
 
### [DEither.right](10-right.ts)

Créer un résultat Right avec une information et une valeur optionnelle.
 
### [DEither.rightAsyncPipe](10-rightAsyncPipe.ts)

Enchaîner des transformations asynchrones sur la valeur d’un Right en arrêtant au premier Left.
 
### [DEither.rightPipe](10-rightPipe.ts)

Enchaîner des transformations sur la valeur d’un Right en arrêtant au premier Left.
 
### [DEither.safeCallback](10-safeCallback.ts)

Convertir une valeur ou une exception d’une callback en Either.
 
### [DEither.some](10-some.ts)

Créer un Right représentant une valeur présente dans un Maybe.
 
### [DEither.success](10-success.ts)

Créer un Right standardisé avec l’information `success`.
 
### [DEither.toMaybe](10-toMaybe.ts)

Convertir une valeur, une absence ou un Either en représentation Maybe.
 
### [DEither.unwrapByInformation](10-unwrapByInformation.ts)

Extraire les variantes portant une information donnée et transmettre les autres.
 
### [DEither.unwrapByInformationOrThrow](10-unwrapByInformationOrThrow.ts)

Extraire une information ciblée ou lever une exception si elle est absente.
 
### [DEither.unwrapLeft](10-unwrapLeft.ts)

Extraire la valeur d’un Left et laisser les autres valeurs inchangées.
 
### [DEither.unwrapLeftOrThrow](10-unwrapLeftOrThrow.ts)

Extraire un Left ou lever une exception lorsque le statut attendu n’est pas présent.
 
### [DEither.unwrapOr](10-unwrapOr.ts)

Extraire la valeur d’un Right ou fournir une valeur de remplacement.
 
### [DEither.unwrapOtherwise](10-unwrapOtherwise.ts)

Extraire la valeur d’un Right ou calculer une valeur de remplacement pour les autres cas.
 
### [DEither.unwrapRight](10-unwrapRight.ts)

Extraire la valeur d’un Right et laisser les autres valeurs inchangées.
 
### [DEither.unwrapRightOrThrow](10-unwrapRightOrThrow.ts)

Extraire un Right ou lever une exception lorsque le statut attendu n’est pas présent.
 
### [DEither.unwrapSelection](10-unwrapSelection.ts)

Extraire les variantes marquées `true` dans une sélection et transmettre les autres.
 
### [DEither.unwrapSelectionOrThrow](10-unwrapSelectionOrThrow.ts)

Extraire une variante sélectionnée ou lever une exception lorsqu’elle ne l’est pas.
 
### [DEither.whenHasInformation](10-whenHasInformation.ts)

Transformer la valeur des variantes portant une information donnée.
 
### [DEither.whenHasInformationOtherwise](10-whenHasInformationOtherwise.ts)

Traiter les variantes ciblées par information et fournir une branche de repli.
 
### [DEither.whenIsLeft](10-whenIsLeft.ts)

Transformer la valeur d’un Left et transmettre les autres résultats inchangés.
 
### [DEither.whenIsLeftOtherwise](10-whenIsLeftOtherwise.ts)

Traiter séparément les Left et les autres résultats.
 
### [DEither.whenIsRight](10-whenIsRight.ts)

Transformer la valeur d’un Right et transmettre les autres résultats inchangés.
 
### [DEither.whenIsRightOtherwise](10-whenIsRightOtherwise.ts)

Traiter séparément les Right et les autres résultats.
 
### [DEither.whenIsSelected](10-whenIsSelected.ts)

Transformer la valeur des variantes marquées `true` dans une sélection.
 
### [DEither.whenIsSelectedOtherwise](10-whenIsSelectedOtherwise.ts)

Transformer les variantes sélectionnées et traiter toutes les autres dans une branche de repli.
 
