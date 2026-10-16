# Résultats, sélecteurs et typage

Consulter [l'exemple exécutable de résultats](examples/results.ts) pour sélectionner une réussite, un échec attendu et vérifier l'extraction typée. La fonction de recherche y sert uniquement de petit contrat autonome à adapter à la fonction réellement testée.

## Une information attendue

`unwrapByInformationOrThrow` vérifie que l'information du résultat fait partie de la sélection demandée et extrait sa valeur. Sélectionner l'information précise plutôt que le seul côté `Right` ou `Left` lorsque plusieurs issues partagent ce côté. Pour un résultat asynchrone, attendre le résultat avant de l'extraire, ou utiliser la forme curifiée dans `DCommon.asyncPipe`.

Après l'extraction, vérifier la valeur avec le runner : propriétés d'un objet, contenu d'une collection, erreur ou cause attendue. Pour une erreur DuploJS, son identifiant peut être vérifié avec `DCommon.DuploJSError.hasIdentifier` ; l'information du `Left` et l'identifiant de l'erreur qu'il contient sont deux contrats distincts.

`DEither.expect` conserve exactement un type déjà contraint à un `Either` ; il ne valide pas une donnée inconnue au runtime.

## Un point de surveillance exhaustif

Le sélecteur de `unwrapSelectionOrThrow` doit contenir toutes les informations de l'union reçue, avec des booléens littéraux : `true` extrait la valeur et `false` fait échouer le test si cette information apparaît. Les clés étrangères à l'union sont refusées. Accepter plusieurs informations n'a de sens que si le même scénario tolère réellement leurs résultats ; la valeur extraite prend alors l'union des valeurs acceptées.

Dans l'exemple, TypeScript infère les résultats possibles de `findUserByEmail` depuis son implémentation. Si une branche retournant une nouvelle information, par exemple `user.disabled`, est ajoutée à la fonction, les sélecteurs incomplets échouent au typage jusqu'à leur révision.

Ne pas réécrire manuellement une union réduite aux résultats déjà connus et ne pas filtrer le résultat avant de l'envoyer au sélecteur : le contrôle porte sur le type reçu à cet endroit. Les sélecteurs surveillent les informations ; une évolution de valeur ou de sous-type d'erreur nécessite les vérifications adaptées sur le contenu et son type.

La compilation vérifie la complétude du sélecteur et `DCommon.ExpectType` vérifie les types obtenus. Le runner vérifie les valeurs et l'échec sur les informations exclues. Lancer ces deux validations dans le projet consommateur.
