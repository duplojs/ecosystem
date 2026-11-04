### Entités, qualifications et faits

Modéliser les données et leurs invariants, certifier leurs conditions actuelles et rendre explicites les préconditions des transitions métier.

---

### Décrire les valeurs possibles

Une entité porte une identité et une forme métier stable. Ses propriétés utilisent les types qui expriment leur sens et leurs contraintes : identifiants distincts, titres bornés, collections limitées ou variantes d'état. Regrouper dans son namespace les types, structures, états, flags et l'union de ses faits permet de retrouver son cycle de vie.

Les propriétés propres à un état appartiennent à une variante de cet état. Dans [`Book`](../fixtures/business/domains/entities/book/index.ts), `state` est une union de `TaggedObject` : disponible, emprunté, réservé ou retiré. Le client emprunteur existe dans `BorrowedState` ; `ReservedState` référence l'entrée de liste d'attente concernée. Ces informations ne deviennent pas des propriétés facultatives communes à tous les livres.

Chaque [`WaitingListEntry`](../fixtures/business/domains/entities/waitingListEntry/index.ts) représente une inscription individuelle. Plusieurs inscriptions peuvent concerner un livre, mais son état `ReservedState` n'en référence qu'une : la réservation effective. Le client reste porté par cette entrée, sans duplication de son `clientId` dans le livre.

Les primitives et leurs API sont présentées dans les fondamentaux : [NewType](../../01-fundamental/06-modeling/10-new-type.ts), [Entity](../../01-fundamental/06-modeling/20-entity.ts) et [TaggedObject](../../01-fundamental/06-modeling/30-tagged-object.ts).

### Qualifier une condition actuelle

Une qualification observe une entité sans modifier ses propriétés métier. Elle vérifie une condition puis retourne la valeur avec le `Flag` correspondant. Un flag peut certifier un état nommé ou une capacité ; plusieurs flags compatibles peuvent coexister.

[`Book.refineState`](../fixtures/business/domains/entities/book/index.ts) reconnaît l'état du livre et produit notamment `AvailableFlag` ou `BorrowedFlag`. Dans [`Client`](../fixtures/business/domains/entities/client/index.ts), l'invariant limite `borrowedBooks` à cinq identifiants. La qualification `canRentBook` vérifie que le client en possède au plus quatre avant une nouvelle location et produit `CanRentBookFlag`. Cette capacité permet au fait de préserver l'invariant en ajoutant un emprunt.

| Besoin | Modélisation |
| --- | --- |
| Décrire les données propres à une variante | État sous forme de `TaggedObject`. |
| Certifier une condition sur l'entité actuelle | Qualification et `Flag`. |
| Certifier une combinaison de plusieurs valeurs | [Refinement](./40-refinements.md) produisant une évidence sur le contexte. |
| Exiger une vérification extérieure ou une provenance | [Evidence](./20-aggregates.md#exiger-les-preuves-utiles-au-parcours) issue du contrat qui établit cette garantie. |

`Flag.append` appartient aux qualifications et aux faits qui établissent réellement sa condition. L'appelant consomme leur résultat ; il ne fabrique pas un flag pour contourner une précondition.

### Définir le contrat d'une transition

Une `Fact` représente une création ou une modification métier. Elle peut lire plusieurs entités, mais ne modifie qu'une seule cible. Chaque changement métier passe par un fait, y compris un changement de propriété qui conserve le même état nommé. Un [agrégat](./20-aggregates.md) coordonne les faits lorsque l'opération touche plusieurs cibles.

La signature du fait exige les états nécessaires à sa transition. [`BookRentalFact`](../fixtures/business/domains/entities/book/facts/rental.ts) reçoit un client portant `CanRentBookFlag` et un livre portant `AvailableFlag`. Il construit l'état emprunté, met à jour le livre, ajoute `BorrowedFlag` et applique le fait. Le client est lu ; sa modification appartient à [`ClientRentBookFact`](../fixtures/business/domains/entities/client/facts/rentBook.ts).

Une évidence appartient au contrat d'un fait si sa garantie est intrinsèque à la transition ; une provenance propre à un parcours relève de l'agrégat. Ainsi, [`PrepareWaitingListEntryFact`](../fixtures/business/domains/entities/waitingListEntry/facts/prepare.ts) exige une entrée en attente, sans imposer sa sélection lors d'un retour. [`CancelWaitingListEntryFact`](../fixtures/business/domains/entities/waitingListEntry/facts/cancel.ts) accepte une entrée en attente ou prête et un motif, pour servir aussi bien le retrait d'un livre qu'une annulation par le client.

### Distinguer l'événement et l'état produit

La payload du fait décrit l'événement ; celle du flag porte les informations de la condition certifiée. Elles peuvent différer. [`ReserveBookFact`](../fixtures/business/domains/entities/book/facts/reserve.ts) conserve `waitingListEntryId` et `clientId` dans sa payload. L'état réservé et son flag ne conservent que `waitingListEntryId`, suffisant pour référencer la réservation effective.

Le fait courant porté par une entité ne constitue pas à lui seul un historique persistant. Si le métier demande cet historique, sa conservation doit être prévue par un contrat dédié.

### Poursuivre avec la nouvelle entité

`Entity.update` est réservé aux faits. Il reconstruit l'entité à partir de ses propriétés déclarées et ne conserve pas automatiquement les anciens flags ni le fait précédent. La transition établit les garanties de la nouvelle valeur, puis les opérations suivantes utilisent cette valeur retournée.

Les propriétés fournies à `update` doivent déjà satisfaire les types métier : cette opération ne réalise pas une validation runtime. Ne pas transférer les preuves de l'ancienne valeur par un spread ou un cast. Le [cycle de vie avec Flag et Fact](../../01-fundamental/06-modeling/40-entity-lifecycle.ts) détaille ces mécanismes.
