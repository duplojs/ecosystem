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

### Choisir la primitive de modélisation

Les propriétés d'une entité portent des types métier explicites, généralement des `NewType`, des structures ou des `TaggedObject` adaptés à leur rôle. Utiliser la primitive correspondant à l'intention évite de confondre identité, forme, état et ordre d'exécution.

| Intention | Primitive | Règle |
| --- | --- | --- |
| Donner une identité métier à une valeur | `NewType` | Deux valeurs de même représentation mais de sens différent ne sont pas interchangeables. Les contraintes de forme sont vérifiées lors du mapping. |
| Décrire une forme identifiée | `TaggedObject` | Son tag permet le pattern matching et le transport entre frontières. Il décrit une shape, pas un cycle de vie ; une union de tags modélise les formes possibles d'une propriété. |
| Certifier une condition sur l'entité actuelle | `Flag` | Une qualification inspecte la valeur puis ajoute le flag correspondant. Le flag peut porter la payload de la vérification ; plusieurs flags peuvent coexister. |
| Représenter une création ou modification métier | `Fact` | Toute transition est un événement, même si l'état final ressemble à l'état initial. Une fact peut lire plusieurs entités, mais ne modifie que sa cible. |
| Imposer une provenance ou un ordre d'exécution | `Evidence` | La preuve identifie l'opération qui doit avoir précédé, indépendamment de la forme de la valeur. Ses contrats sont détaillés dans les [agrégats](./20-aggregates.md) et les [repositories](./30-repositories.md). |

Un `Flag` et une `Evidence` peuvent sembler proches, mais leur centre de gravité diffère : le flag certifie une caractéristique ou une qualification de l'état courant d'une entité ; l'évidence certifie un passage requis par le parcours d'exécution, indépendamment de la nature de la valeur. Une condition d'état se modélise donc par un flag ; une dépendance d'ordre ou de provenance se modélise par une evidence.

Une fonction de qualification peut être utilisée après l'hydratation d'une entité, y compris par l'infrastructure. Elle ne modifie pas les propriétés métier et ne réalise aucune transition ; `Flag.append` est utilisé seulement après la vérification de la condition, dans une qualification ou une `Fact`.

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

La fact portée par l'entité représente le fait courant ; conserver un historique persistant des transitions demande un mécanisme dédié. Les entités, flags et évidences sont immuables : après `update`, poursuivre avec la nouvelle valeur et ne pas transférer automatiquement les preuves de l'ancienne. Une preuve devenue fausse entre la qualification et la persistance révèle une contrainte de concurrence ou de transaction à traiter dans le contrat d'orchestration, pas une raison de rendre les preuves mutables.
