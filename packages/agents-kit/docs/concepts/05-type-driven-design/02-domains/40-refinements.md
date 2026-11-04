### Refinements : qualifier un contexte métier

Vérifier une combinaison d'entités ou de valeurs et produire la preuve de cet état commun sans réaliser de transition.

---

### Affiner plusieurs valeurs ensemble

Un refinement est une fonction pure du domaine qui vérifie une condition sur plusieurs valeurs et retourne ce contexte avec une preuve, sans modifier les entités. Un livre emprunté et un client existant peuvent chacun satisfaire leurs qualifications sans être liés : leur association exige une vérification supplémentaire.

### Produire une preuve exploitable

La fixture [`refineLinkBetweenClientAndBorrowedBook`](../fixtures/business/domains/refinements/refineLinkBetweenClientAndBorrowedBook.ts) reçoit un client et un livre portant déjà `BorrowedFlag`. Elle vérifie que l'identifiant du livre figure dans `client.borrowedBooks` et que l'emprunteur déclaré par le livre correspond à ce client.

| Condition constatée | Résultat |
| --- | --- |
| Le client référence le livre et le livre désigne ce client comme emprunteur | `client-with-borrowed-book`, avec le couple client-livre portant cette évidence. |
| Au moins l'une de ces conditions manque | `client-and-book-without-link`, avec le même contexte et l'évidence de cette autre condition. |

L'agrégat [`clientGiveBackBook`](../fixtures/business/domains/aggregates/clientGiveBackBook.ts) exige uniquement la combinaison `client-with-borrowed-book` avec [GetEvidenceResult](./20-aggregates.md#exiger-les-preuves-utiles-au-parcours). L'appelant sélectionne cette issue avant de lancer l'opération.

### Choisir entre refinement et repository

Le refinement convient lorsque les valeurs présentes suffisent à vérifier la relation. Le [repository](./30-repositories.md) établit les garanties dépendant d'une opération extérieure, par exemple une sélection dans une liste d'attente absente de la mémoire. Les deux peuvent produire des évidences.

### Consommer le contexte qualifié

L'application ou le [point d'entrée](../04-infrastructure/10-implementation.md#préparer-les-entrées-et-adapter-les-résultats) peut appeler le refinement pour préparer les paramètres du use case.

La preuve vaut pour les valeurs vérifiées. Si une transition produit de nouvelles entités, leur combinaison doit à nouveau satisfaire les conditions nécessaires aux étapes suivantes. Conserver artificiellement l'évidence du contexte précédent ne démontre pas ces conditions.
