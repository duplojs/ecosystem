### Conception des agrégats en Type-Driven Design

Points d'entrée des transactions métier, préconditions et preuves, orchestration et réutilisation des faits.
---

### Réaliser une opération métier complète

Dans ce Type-Driven Design, un **agrégat est une fonction pure de transaction métier** : il définit les préconditions d'une opération du domaine et orchestre les faits nécessaires à son exécution. Son nom exprime cette opération, comme `clientRentBook` ou `createBook`.

Une `Fact` réalise une transition sur une entité cible. L'agrégat choisit les faits à appeler, relie leurs entrées et leurs sorties et rassemble les résultats. Il peut appeler un seul fait : sa signature peut déjà exprimer des exigences propres à la transaction, comme la provenance d'un identifiant ou l'absence d'un titre dans les livres enregistrés.

Les faits restent réutilisables dans plusieurs agrégats. Chaque transaction décide de leurs conditions d'utilisation et de leur combinaison, sans imposer ces choix aux autres transactions.

### Préconditions de la transaction

L'agrégat exige les preuves dans sa signature : des `Flag` pour les conditions établies sur les entités, des `Evidence` pour le passage par une opération et les conditions qu'elle établit. Les couches appelantes lui fournissent les entrées qualifiées.

### Exemple : coordonner la location d'un livre

L'[agrégat `clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts#L6) exige un `Client.Entity & Client.CanRentBookFlag` et un `Book.Entity & Book.AvailableFlag`. La couche appelante qualifie les entités et gère les situations où ces preuves ne peuvent pas être établies.

1. [`ClientRentBookFact`](../fixtures/business/domains/entities/client/facts/rentBook.ts#L11) ajoute l'identifiant du livre aux emprunts du client et retourne le client modifié.
2. [`BookRentalFact`](../fixtures/business/domains/entities/book/facts/rental.ts#L10) passe le livre à l'état emprunté, associé à l'identifiant du client, et retourne le livre modifié.
3. L'agrégat rassemble ces résultats sous les propriétés `client` et `book` d'un `Resolver` et déclare le besoin `sendInformationalEmail`.

Les deux faits reçoivent ici les mêmes entrées qualifiées : chacun produit la nouvelle valeur de son entité cible. Si une orchestration enchaîne plusieurs modifications sur une même entité, les étapes suivantes doivent utiliser **la valeur retournée par la fact précédente**, avec les preuves exigées pour cette étape. Les entités sont immuables ; réutiliser la valeur initiale ferait perdre les modifications intermédiaires.

L'[agrégat `clientGiveBackBook`](../fixtures/business/domains/aggregates/clientGiveBackBook.ts#L6) coordonne également un fait pour le client et un autre pour le livre, puis expose leurs résultats et le besoin `rankBookAvailability`.

### Exemple : créer un livre avec un titre non enregistré

La création illustre deux préconditions ajoutées par l'agrégat au contrat du fait : la génération de l'identifiant et l'absence d'un livre déjà enregistré avec le même titre.

| Contrat | Préconditions |
| --- | --- |
| [`CreateBookFact`](../fixtures/business/domains/entities/book/facts/create.ts#L12) | Un `Book.Id` et un `Book.Title`, pour créer le livre disponible. |
| [Agrégat `createBook`](../fixtures/business/domains/aggregates/createBook.ts#L5) | Un identifiant portant la preuve `generated` et un titre portant la preuve `title-not-registered`. |

Ces preuves sont produites par [`BookRepository.generateId`](../fixtures/business/domains/repositories/book.ts#L6) et [`BookRepository.titleIsAlreadyRegistered`](../fixtures/business/domains/repositories/book.ts#L7). Le [cas d'usage `CreateBookUseCase`](../fixtures/business/applications/useCases/createBook.ts#L7) prépare les entrées et appelle l'agrégat uniquement lorsque le titre n'est pas enregistré. Un `Book.Title` seul ne satisfait pas cette précondition.

Les contraintes de `Book.Title` décrivent la forme du titre. Son absence dans les livres enregistrés dépend de l'état du catalogue : l'évidence rend ce constat préalable **exigible dans le contrat de la transaction**. Elle permet de porter une garantie métier qui dépasse les seules propriétés de la valeur.

Un autre agrégat pourrait appeler la même fact avec une autre provenance d'identifiant ou d'autres préconditions sur le titre. **Les exigences propres à la transaction appartiennent à l'agrégat ; la création de l'entité appartient au fait.** Voir [les preuves de passage](../../01-fundamental/06-modeling/50-evidence.ts) pour le mécanisme `Evidence`.

### Persistance et ordre des effets

L'agrégat exprime les résultats métier et, lorsqu'il retourne un résolveur, les effets attendus. Il reste pur : retourner un résolveur déclare les besoins d'effets sans les exécuter pendant la transaction métier.

Le [cas d'usage `ClientRentBookUseCase`](../fixtures/business/applications/useCases/clientRentBook.ts#L7) illustre l'exécution du résolveur et la sauvegarde des résultats. Si l'envoi exige un enregistrement préalable, `runAndResolve` permet de préparer les résultats avant de déclencher les effets.

### Concevoir un nouvel agrégat

1. **Délimiter la transaction.** Identifier l'opération métier prise en charge par l'agrégat.
2. **Exiger les préconditions.** Déterminer les données et les preuves nécessaires pour engager cette transaction.
3. **Choisir les faits.** Identifier les transitions nécessaires sur les entités, en réutilisant les faits existants.
4. **Organiser leur enchaînement.** Relier les faits selon leurs dépendances et faire progresser le cycle de vie à partir des entités produites.
5. **Restituer le résultat métier.** Rassembler les entités produites et déclarer les éventuels effets attendus.

Voir [la conception des entités](./10-entities.md) pour les invariants, les preuves et le contrat des transitions.

Voir [les repositories](./30-repositories.md) pour les contrats des opérations techniques qui fournissent les données, les preuves de préconditions et les effets requis par les agrégats.
