### Conception des entités en Type-Driven Design

Organisation des modèles métier, de leurs invariants, qualifications et transitions dans le domaine.
---

### Placer les règles métier

Concevoir une entité consiste à définir ses données, les conditions nécessaires aux opérations métier et les garanties obtenues après chaque transition. Les primitives sont documentées dans les fondamentaux : [NewType](../../01-fundamental/06-modeling/10-new-type.ts), [Entity](../../01-fundamental/06-modeling/20-entity.ts), [TaggedObject](../../01-fundamental/06-modeling/30-tagged-object.ts) et [cycle de vie avec Flag et Fact](../../01-fundamental/06-modeling/40-entity-lifecycle.ts).

Les règles suivantes sont des **conventions d'architecture du domaine** :

| Responsabilité | Placement et règle |
| --- | --- |
| Définir le modèle | Regrouper dans le namespace TypeScript de l'entité son `createEntityNamespace`, ses `NewType`, sa définition commune, ses états, ses flags et l'union de ses `Facts`. Représenter les propriétés pouvant changer de forme par des unions, notamment de `TaggedObject`. |
| Qualifier une condition | Une fonction du namespace inspecte les données sans modifier les propriétés métier et ajoute le flag correspondant uniquement après vérification. La condition peut porter sur un état, une capacité ou une relation avec une autre entité. |
| Créer ou modifier l'entité | Une `Fact` de son dossier `facts/` porte chaque création ou modification métier, même un simple changement de propriété. Elle peut lire plusieurs entités, mais ne modifie que sa cible. `Entity.update` est réservé aux faits ; ils ajoutent les flags dont leur transition établit les conditions. |
| Hydrater des données existantes | Utiliser les API de mapping décrites dans [Entity](../../01-fundamental/06-modeling/20-entity.ts). Cette entrée dans le modèle ne constitue pas une création métier. |
| Coordonner plusieurs cibles | Prévoir un fait par entité modifiée et confier leur orchestration à un [agrégat](./20-aggregates.md). |

`Flag.append` est réservé aux qualifications et aux faits décrits ci-dessus. Le placement de l'appel et la vérification de sa condition relèvent de ces conventions ; la présence d'un flag dans le type ne dispense pas son producteur d'établir la garantie annoncée.

Une fonction de qualification ou de requalification peut être consommée par l'infrastructure lorsqu'elle doit vérifier l'état d'une entité hydratée avant de la transmettre à l'application. Cette vérification ajoute la preuve correspondant à une condition constatée ; elle ne crée ni ne modifie l'entité métier. Les transitions restent exclusivement réalisées par les `Fact` du domaine.

### Distinguer invariant et précondition

Un invariant doit rester vrai pour toute valeur de l'entité. Une précondition détermine si une opération particulière est possible et devient une preuve exigée par sa signature.

Dans la fixture [`Client`](../fixtures/business/domains/entities/client/index.ts), `borrowedBooks` contient au maximum **cinq** identifiants. `Client.canRentBook` vérifie une limite de **quatre** avant une nouvelle location et produit un résultat `CanRentBook` portant `CanRentBookFlag`, ou `NoBookRentalSlotsAvailable`. Le fait peut ainsi ajouter un livre en préservant l'invariant. Une capacité à agir mérite une qualification même si elle ne constitue pas un état du cycle de vie.

### Définir le contrat d'une transition

Exiger les preuves en entrée, construire des propriétés portant les contraintes attendues, créer ou mettre à jour la cible, puis ajouter les garanties de sortie et appliquer le fait. Le [cycle de vie](../../01-fundamental/06-modeling/40-entity-lifecycle.ts) détaille les API et la reconstruction des preuves après `update`.

La fixture [`BookRentalFact`](../fixtures/business/domains/entities/book/facts/rental.ts) illustre ce contrat :

| Étape | Contrat |
| --- | --- |
| Entrée | Un `Client.Entity & Client.CanRentBookFlag` et un `Book.Entity & Book.AvailableFlag`. Pour le livre, qualifier avec [`Book.refineState`](../fixtures/business/domains/entities/book/index.ts) puis sélectionner la branche disponible. |
| Transformation | Construire un `BorrowedState` avec l'identifiant du client et mettre à jour le livre. Le client est lu, sans être modifié par ce fait. |
| Sortie | Ajouter `BorrowedFlag` et appliquer `BookRentalFact` avec le nouvel état comme payload. `run` enveloppe la valeur `Book.Entity & Book.BorrowedFlag & BookRentalFact` dans un `Either` droit. |

Après une transition, poursuivre avec **l'entité retournée**. Les preuves d'une ancienne valeur décrivent la situation antérieure et ne doivent pas être transférées sans vérification. Les valeurs fournies à `update` doivent déjà porter le typage métier attendu : cette opération ne valide pas les nouvelles propriétés au runtime, comme précisé dans [Entity](../../01-fundamental/06-modeling/20-entity.ts).

La fact portée par l'entité représente le fait courant ; conserver un historique persistant des transitions demande un mécanisme dédié.
