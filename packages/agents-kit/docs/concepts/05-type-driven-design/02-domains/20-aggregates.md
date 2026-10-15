### Conception des agrégats en Type-Driven Design

Contrats des transactions métier, préconditions et orchestration de faits réutilisables.
---

### Délimiter une transaction métier

Dans ce Type-Driven Design, un **agrégat est une fonction pure de transaction métier**. Son nom exprime l'opération prise en charge. Il exige ses préconditions dans sa signature, choisit les faits nécessaires, relie leurs entrées et leurs sorties et rassemble les résultats métier.

Les [faits](./10-entities.md) portent les transitions de chaque cible et restent réutilisables dans plusieurs agrégats. Un agrégat peut appeler un seul fait : ses exigences peuvent déjà différer de celles de cette transition.

Pour concevoir l'opération, déterminer ses entrées et leurs preuves, choisir les faits, organiser leur enchaînement selon leurs dépendances, puis restituer les entités produites et les éventuels besoins d'effets. Les couches appelantes fournissent les entrées qualifiées et gèrent les situations où les préconditions ne peuvent pas être établies. La décision de créer un agrégat vient du besoin métier ; elle ne se déduit pas seulement du nombre d'entités dans les paramètres.

Un agrégat n'appelle jamais un repository et n'exécute jamais une dépendance fournie par l'extérieur. Il reste pur : pour les mêmes entrées, il produit le même résultat métier et les mêmes besoins déclarés. L'application appelle les repositories, prépare les entrées puis appelle l'agrégat.

### Coordonner plusieurs entités

La fixture [`clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts) exige un `Client.Entity & Client.CanRentBookFlag` et un `Book.Entity & Book.AvailableFlag`.

Elle appelle [`ClientRentBookFact`](../fixtures/business/domains/entities/client/facts/rentBook.ts) pour ajouter le livre aux emprunts du client et [`BookRentalFact`](../fixtures/business/domains/entities/book/facts/rental.ts) pour passer le livre à l'état emprunté. Les deux faits reçoivent ici les mêmes entrées qualifiées et produisent chacun la nouvelle valeur de leur cible.

Si plusieurs faits modifient successivement **la même entité**, transmettre à chaque étape la valeur retournée par la précédente, avec les preuves exigées. Réutiliser l'entrée initiale ferait perdre les modifications intermédiaires.

Une `Fact` représente l'événement du cycle de vie d'une seule entité. Lorsque le métier coordonne plusieurs entités dans la même opération, l'agrégat orchestre les faits correspondants. Si cette coordination n'est pas une exigence du métier, les transitions peuvent rester dans des opérations distinctes.

### Ajouter les exigences propres à la transaction

La fixture [`createBook`](../fixtures/business/domains/aggregates/createBook.ts) distingue le contrat de création de l'entité et celui de la transaction :

| Contrat | Préconditions |
| --- | --- |
| [`CreateBookFact`](../fixtures/business/domains/entities/book/facts/create.ts) | Un `Book.Id` et un `Book.Title`. |
| Agrégat `createBook` | Un identifiant portant la preuve `generated` et un titre portant la preuve `title-not-registered`, exigés avec `GetEvidenceResult`. |

Ces garanties proviennent du contrat de [`BookRepository`](../fixtures/business/domains/repositories/book.ts). Les contraintes de `Book.Title` décrivent sa forme ; l'absence du titre dans le catalogue dépend d'une vérification extérieure. Un titre seul ne satisfait donc pas le contrat de l'agrégat. Voir [les preuves de passage](../../01-fundamental/06-modeling/50-evidence.ts) pour le mécanisme `Evidence` et [les repositories](./30-repositories.md) pour les opérations qui les produisent.

Un autre agrégat peut réutiliser le même fait avec d'autres préconditions. **Les exigences de la transaction appartiennent à l'agrégat ; la création ou modification de l'entité appartient au fait.**

Le niveau d'exigence dépend de l'orchestration choisie. Une `Fact` peut exiger directement une évidence lorsqu'une transition impose une provenance, tandis que l'agrégat ou une étape intermédiaire peut l'exiger lorsque la contrainte concerne le parcours complet. Ne pas ajouter cette exigence à une transition qui autorise volontairement plusieurs provenances.

### Déclarer les effets attendus

Lorsqu'une transaction nécessite des effets, retourner un `Resolver` contenant les résultats métier et le contrat des opérations attendues. Sa construction déclare ces besoins sans les exécuter : l'agrégat reste pur.

Le `Resolver` est optionnel. Un agrégat sans effet peut retourner directement sa valeur ou son `Either`; l'utiliser sert à rassembler plusieurs résultats et à déclarer les effets nécessaires, sans les exécuter.

Dans `clientRentBook`, le résolveur rassemble `client` et `book` et exige `sendInformationalEmail`, typé par `EmailRepository["sendRentInformationalEmail"]`. L'[application](../03-applications/10-use-case.md) fournit les implémentations, exécute le résolveur et décide de l'ordre des effets et de la persistance.

Le résolveur décrit les conséquences attendues de l'événement métier ; l'application décide de leur ordre, de leur criticité et de leur stratégie d'exécution. Si un effet doit réussir avant de poursuivre, la composition du use case doit arrêter les étapes suivantes lorsqu'il renvoie un `Left`.
