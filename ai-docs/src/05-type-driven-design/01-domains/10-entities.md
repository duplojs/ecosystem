### Conception des entités en Type-Driven Design

Organisation des données métier et de leur cycle de vie : identité, invariants, qualification des états, préconditions et transitions contrôlées. Règles architecturales assurant la cohérence des entités au fil de leurs modifications.
---

### Entité, preuve et transition

Concevoir une entité consiste à définir ses données, les conditions nécessaires aux opérations métier et les garanties obtenues après chaque transition.

| Concept | Rôle |
| --- | --- |
| `NewType` | Donne une identité métier à une valeur et porte les contraintes de sa représentation. Deux identifiants UUID, comme `Book.Id` et `Client.Id`, restent non interchangeables. |
| `Entity` | Déclare les propriétés et les invariants de la donnée métier identifiée. Sa définition reste commune pendant le cycle de vie ; les états possibles sont représentés par des unions de propriétés, notamment des `TaggedObject`. |
| `Flag` | Porte une condition établie sur une entité et une payload associée : état courant, capacité à agir ou relation avec une autre entité. Les signatures exigent ces preuves avec une intersection, comme `Book.Entity & Book.AvailableFlag`. |
| `Fact` | Représente une création ou une modification métier effectuée sur une entité cible. Son exécution produit l'entité avec le fait courant et les garanties établies par la transition. |

### Règles de placement dans le domaine

Les règles suivantes sont des **conventions d'architecture** à appliquer au code du domaine :

- **Déclarer l'entité** dans son namespace TypeScript, avec `createEntityNamespace`, ses `NewType`, ses états, ses flags et l'union de ses `Facts`.
- **Qualifier l'entité** avec des fonctions de ce namespace. Elles inspectent les données sans modifier les propriétés métier et ajoutent les flags correspondant aux conditions vérifiées.
- **Créer ou modifier l'entité métier** dans une `Fact` de son dossier `facts/`, même pour une modification simple de propriété. L'hydratation de données existantes relève des API de mapping ; elle ne constitue pas une création métier.
- **Ajouter un flag** uniquement dans une fonction de qualification ou dans une `Fact` qui établit la condition correspondante.
- **Coordonner plusieurs entités** dans un agrégat. Une `Fact` peut lire plusieurs entités, mais ne modifie que son entité cible.

Les appels à `Entity.update` sont réservés aux `Fact`. Les appels à `Flag.append` sont réservés aux fonctions de qualification du namespace de l'entité et aux `Fact`. Avant d'appeler `append`, la fonction de qualification doit avoir vérifié la condition métier, ou la `Fact` doit l'avoir établie par sa transition.

### Démarche de conception

1. **Définir l'identité et les invariants.** Choisir les `NewType`, les propriétés et leurs contraintes. Distinguer ce qui doit rester vrai pour toute entité des conditions nécessaires à une opération particulière.
2. **Représenter les états possibles.** Déclarer leurs données avec des unions et des `TaggedObject`, en conservant une définition commune de l'entité. Pour ajouter un état, étendre l'union et la qualification correspondante.
3. **Qualifier les préconditions.** Déclarer les flags nécessaires et les fonctions qui les établissent. Une condition peut dépendre d'une autre entité, sans être un état du cycle de vie.
4. **Définir chaque transition dans une `Fact`.** Exiger les preuves en entrée, construire des valeurs portant les contraintes attendues, créer ou mettre à jour l'entité cible, puis ajouter les flags de sortie et appliquer le fait. Une modification simple suit la même démarche, même sans changement d'état.
5. **Coordonner les transitions si nécessaire.** Si une opération modifie plusieurs entités, prévoir une `Fact` par cible et un agrégat pour les exécuter et réunir leurs résultats.

### Exemple : louer un livre

Les fixtures illustrent cette démarche avec [`Book`](../fixtures/business/domains/entities/book/index.ts#L10) et [`Client`](../fixtures/business/domains/entities/client/index.ts#L10).

**Invariant et précondition.** `Client.Entity.borrowedBooks` contient au maximum **cinq** identifiants de livres. Avant une nouvelle location, [`Client.canRentBook`](../fixtures/business/domains/entities/client/index.ts#L48) vérifie que le client en possède au maximum **quatre**. Elle produit un résultat `CanRentBook` avec `CanRentBookFlag`, ou `NoBookRentalSlotsAvailable`. La limite structurelle et la preuve nécessaire pour ajouter un livre remplissent donc deux rôles distincts.

**Qualification du livre.** [`Book.refineState`](../fixtures/business/domains/entities/book/index.ts#L70) inspecte `state` et retourne un résultat portant `AvailableFlag` ou `BorrowedFlag`. L'appelant sélectionne la branche disponible pour obtenir le type exigé par la location.

**Transition du livre.** [`BookRentalFact`](../fixtures/business/domains/entities/book/facts/rental.ts#L10) exprime le contrat suivant :

| Étape | Contrat |
| --- | --- |
| Entrée | Un `Client.Entity & Client.CanRentBookFlag` et un `Book.Entity & Book.AvailableFlag`. |
| Transformation | Construire un `BorrowedState` avec l'identifiant du client, puis mettre à jour le livre. |
| Sortie | Ajouter `BorrowedFlag`, puis appliquer `BookRentalFact` avec le nouvel état comme payload. La valeur métier retournée porte `Book.Entity & Book.BorrowedFlag & BookRentalFact`. |

`BookRentalFact.run` retourne cette valeur dans un `Either` droit ; le type métier ci-dessus décrit la valeur après extraction, pas le résultat enveloppé de `run`.

**Coordination.** La location modifie également le client : [`ClientRentBookFact`](../fixtures/business/domains/entities/client/facts/rentBook.ts#L11) ajoute le livre à `borrowedBooks`. L'[agrégat `clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts#L6) exécute les deux faits et rassemble le client et le livre retournés. Chaque fait conserve une seule cible. Voir [les agrégats](./20-aggregates.md) pour la conception de ces transactions métier.

### Garanties après une transition

`Entity.update` retourne une nouvelle entité reconstruite à partir de ses propriétés déclarées : **les anciens flags et la précédente fact ne sont pas conservés sur cette nouvelle valeur**. La transition ajoute les preuves valables pour le nouvel état. Les nouvelles propriétés doivent déjà porter le typage métier attendu ; `update` ne les valide pas au runtime.

Les qualifications ultérieures doivent utiliser l'entité retournée par la transition. Une ancienne valeur qualifiée décrit la situation antérieure ; ses preuves ne doivent pas être transférées à la nouvelle valeur sans vérification.

La fact portée par l'entité identifie le fait courant et sa payload. Elle ne constitue pas un journal persistant des transitions passées ; l'historisation nécessite un mécanisme dédié.

### Références complémentaires

- [NewType](../../01-fundamental/06-modeling/10-new-type.ts) : déclaration et contraintes des valeurs métier.
- [Entity](../../01-fundamental/06-modeling/20-entity.ts) : déclaration, hydratation et contrat de mise à jour.
- [Cycle de vie des entités](../../01-fundamental/06-modeling/40-entity-lifecycle.ts) : API de qualification, création et transition avec `Flag` et `Fact`.
