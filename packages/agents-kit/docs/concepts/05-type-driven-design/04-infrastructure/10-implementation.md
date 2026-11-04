### Infrastructure : réaliser et raccorder les contrats

Implémenter les capacités techniques demandées par l'application, établir réellement leurs garanties et exposer les opérations aux consommateurs.

---

### Partir d'un contrat déjà déterminé

L'infrastructure réalise le stockage, la génération d'identifiants, le transport de messages, les services externes et les points d'entrée. Elle choisit les technologies et les modalités d'accès selon les contrats et les [frontières de l'architecture](../01-architecture/10-boundaries.md).

### Implémenter les garanties des ports

Le [chapitre des ports](../03-applications/20-ports.md) définit le contrat à réaliser et sa déclaration avec `createImplementation`. Les [fixtures d'implémentation](../fixtures/infrastructure/ports/index.ts) fournissent les repositories de livres, clients, courriels et inscriptions. Ce sont des squelettes de raccordement : leurs valeurs de démonstration ne constituent pas une implémentation de stockage ni de service de courriel.

Dans une réalisation concrète, chaque méthode doit établir la garantie de son contrat avant de retourner la valeur prouvée :

| Contrat | Travail de l'implémentation |
| --- | --- |
| Recherche d'une entité | Lire puis hydrater les données avec les structures du domaine ; représenter l'absence selon le résultat prévu. |
| Sélection de la prochaine inscription | Appliquer les [critères et l'ordre du repository](../02-domains/30-repositories.md#décrire-la-garantie-au-delà-de-la-forme), puis retourner la branche prouvée. |
| Flux des inscriptions actives | Lire progressivement le périmètre complet défini par ce contrat, hydrater et qualifier les entrées, puis fournir les éléments avec leur évidence. |
| Sauvegarde d'une entité issue d'un fait | Persister la valeur transmise en respectant les garanties du port. |
| Action signée | Fournir l'opération identifiée et réaliser effectivement le traitement annoncé. |

Une requête filtrée sur un état ne remplace pas la qualification du domaine. L'implémentation hydrate puis qualifie l'entité pour obtenir le flag exigé. Si les données contredisent le contrat attendu, elle traite cette incohérence selon le contrat technique ; elle ne fabrique pas le flag ou l'évidence manquante.

### Implémenter une méthode aux résultats étendus

Placer `withAdditionalResult` autour de la callback dans l'objet passé à `createImplementation` pour implémenter une [méthode aux résultats étendus](../03-applications/20-ports.md#ajouter-les-résultats-propres-à-lexécution-technique). La [fixture des inscriptions](../fixtures/infrastructure/ports/waitingListEntry.ts) l'utilise sur `findAllActiveByBook` pour fournir le générateur asynchrone ou une promesse du refus `waiting-list-stream-unavailable`.

Le helper reconstruit une signature de travail depuis l'union : la branche sans paramètres ne rend pas les arguments métier facultatifs et les retours promis sont réunis en une promesse des différentes issues. Au runtime, il restitue la même fonction, sans exécution ni validation.

Le contrat public est restitué par une assertion : les relations génériques ne sont plus vérifiées dans la callback. Si la méthode promet le type précis de l'entité reçue, l'implémentation doit le conserver ; retourner seulement les propriétés communes ne respecte pas ce contrat, même si la signature reconstruite l'accepte.

### Résoudre les use cases une fois les ports fournis

Fournir les implémentations selon les [noms d'injection des ports](../03-applications/20-ports.md#associer-le-contrat-à-une-référence-de-dépendance), puis résoudre les Readers avec `Reader.run` pour un use case isolé ou `resolveReaders` pour un ensemble. La [fixture de résolution](../fixtures/infrastructure/useCases/index.ts) expose ainsi les fonctions applicatives partagées par les points d'entrée.

### Préparer les entrées et adapter les résultats

Un point d'entrée valide les données externes avec les structures du domaine, prépare les paramètres demandés par le use case, l'appelle puis traduit son résultat pour le consommateur.

La [route HTTP de location](../fixtures/infrastructure/http/routes/clientRentBook.ts) et la [commande de location](../fixtures/infrastructure/command/clientRentBook.ts) valident les identifiants, recherchent les entités et obtiennent les flags nécessaires pour appeler le même use case. Le protocole change, le contrat applicatif reste identique.

La [route de retour](../fixtures/infrastructure/http/routes/clientGiveBackBook.ts) qualifie le livre comme emprunté, puis appelle le refinement client-livre. Elle transmet le contexte accepté au use case et adapte ses deux issues métier en succès HTTP, ou `waiting-list-selection-unavailable` en réponse 503.

Les mécanismes propres aux transports sont documentés dans les [routes HTTP](../../02-server/20-http/20-route.ts), les [routines de vérification](../../02-server/20-http/30-routine.ts) et les [commandes](../../02-server/40-command/10-use.ts).
