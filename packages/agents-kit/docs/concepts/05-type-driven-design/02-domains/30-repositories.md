### Repositories : capacités extérieures du domaine

Définir les opérations extérieures utiles au métier, leurs résultats et leurs garanties sans exposer leur réalisation technique.

---

### Nommer les opérations dont le métier a besoin

Un repository décrit les entrées, les issues et les garanties d'une capacité extérieure au domaine. Ce rôle couvre les lectures, les vérifications sur des collections, la génération d'identifiants, les flux d'entités ou l'envoi d'un courriel, sans exposer leur réalisation technique.

| Besoin du domaine | Contrat de la fixture |
| --- | --- |
| Disposer d'un identifiant généré | [`BookRepository.generateId`](../fixtures/business/domains/repositories/book.ts). |
| Savoir si un titre figure déjà au catalogue | `BookRepository.titleIsAlreadyRegistered`. |
| Retrouver une entité existante | `BookRepository.findById` et [`ClientRepository.findById`](../fixtures/business/domains/repositories/client.ts). |
| Choisir la prochaine inscription ou parcourir les inscriptions actives | [`WaitingListEntryRepository`](../fixtures/business/domains/repositories/waitingListEntry.ts). |
| Envoyer le courriel d'information de location | [`EmailRepository.sendRentInformationalEmail`](../fixtures/business/domains/repositories/email.ts). |

Un nom d'opération métier et une signature précise rendent le besoin implémentable. Une méthode générique qui laisse à chaque appelant le choix des filtres ou de l'ordre peut laisser des décisions métier hors du domaine.

### Décrire la garantie, au-delà de la forme

Le contrat doit expliquer ce que le résultat certifie. Pour `findNextPendingForBook`, il s'agit de l'entrée en attente du livre fourni ayant la date de demande la plus ancienne ; l'identifiant départage les dates égales. Le résultat contient le livre disponible et cette entrée qualifiée. L'autre issue certifie l'absence d'entrée en attente pour ce livre.

Les deux issues normales sont `next-pending-waiting-list-entry` et `no-pending-waiting-list-entry`. Elles utilisent [EvidenceResult](../../01-fundamental/06-modeling/50-evidence.ts) pour associer leur information à l'évidence de même nom sur leur valeur.

Pour `findAllActiveByBook`, le résultat est un générateur asynchrone : il fournit une fois chaque entrée active du livre retiré, encore en attente ou déjà prête. Les entrées annulées sont exclues. Chaque élément contient le livre et l'entrée qualifiée, avec l'évidence `active-waiting-list-entry-for-withdrawn-book`. Le contrat porte sur chaque élément et sur le périmètre complet du flux ; le type de l'élément ne suffit pas à prouver l'exhaustivité de sa lecture.

### Exiger un résultat sans appeler l'implémentation

Le contrat peut fournir une précondition, comme le titre vérifié de `createBook`, ou le contexte d'un `resolve` ou d'un `iterate`. L'agrégat exige ces résultats avec [GetEvidenceResult](./20-aggregates.md#exiger-les-preuves-utiles-au-parcours). Pour demander une opération identifiée, comme le courriel de location ou `BookRepository.rankAvailability`, il utilise un [commit signé](./20-aggregates.md#transmettre-une-donnée-avec-commit).

### Laisser les contraintes techniques à l'application

Le [port applicatif](../03-applications/20-ports.md#ajouter-les-résultats-propres-à-lexécution-technique) ajoute les refus techniques aux résultats métier. L'[infrastructure](../04-infrastructure/10-implementation.md#implémenter-les-garanties-des-ports) établit les garanties annoncées : une autre technologie peut satisfaire le même contrat si elle en respecte le sens, au-delà de la compatibilité TypeScript.
