## Discrimination

La discrimination consiste à identifier précisément une valeur parmi plusieurs possibilités afin d'adapter son typage et son traitement au cas réellement rencontré.

Dans DuploJS, il faut privilégier les données qui possèdent une identité explicite et utiliser les outils de discrimination associés :

- `matchWithEntity` pour discriminer des `Entity` ;
- `matchWithFact` pour discriminer les `Fact` portées par une valeur ;
- `matchWithTaggedObject` pour discriminer des `TaggedObject` ;
- `matchWithString` et `matchWithNumber` pour discriminer des unions de literals.

Ces outils permettent notamment de réaliser des sélections exhaustives. L'ajout d'une nouvelle possibilité dans une union oblige alors le code concerné à prendre explicitement en charge ce nouveau cas.

Les variantes `otherwise` permettent au contraire de ne sélectionner qu'une partie des possibilités tout en conservant un typage précis de ce qui reste à traiter.

Lorsque la donnée ne possède pas de discriminant exploitable, `match`, `when` et `whenNot` permettent également une discrimination par élimination à partir de sa shape ou de predicates.

Cette dernière approche est principalement utile pour manipuler des données externes ou des modèles dont la conception ne permet pas une discrimination plus explicite. Lorsque le modèle est contrôlé, il faut préférer une identité clairement représentée dans la donnée.