### Assembler l'application dans l'infrastructure

Fournir les dépendances concrètes de l'application et raccorder ses capacités aux points d'entrée du système.
---

### Rôle de l'infrastructure

L'infrastructure assemble l'application dans un contexte concret : base de données, services externes, génération d'identifiants, envoi de messages ou point d'entrée. Elle dépend des contrats exposés par le domaine et l'application ; le domaine et les use cases ne dépendent pas d'une technologie d'infrastructure.

Le sens des dépendances et les responsabilités aux frontières sont définis dans [les frontières de l'architecture](../01-architecture/10-boundaries.md). Ce chapitre se concentre sur leur mise en œuvre : fournir les ports demandés par l'application, résoudre les use cases et les rendre accessibles aux consommateurs.

### Implémenter les ports applicatifs

Un port applicatif exprime une capacité dont un use case a besoin. Son implémentation appartient à l'infrastructure, qui choisit la technologie concrète tout en préservant le contrat du port : signatures, résultats, preuves et autres garanties annoncées.

La déclaration des capacités et l'extension d'un contrat de domaine par un port applicatif sont expliquées dans [les repositories](../02-domains/30-repositories.md) et [les use cases](../03-applications/10-use-case.md). L'infrastructure fournit ensuite une implémentation compatible avec ce contrat ; elle ne déduit pas une garantie du seul typage et ne remplace pas une transition métier par un traitement technique.

Les [implémentations des ports de la fixture](../fixtures/infrastructure/ports/index.ts) construisent ainsi `bookRepository`, `clientRepository` et `emailRepository` depuis les ports applicatifs. Un même port peut être partagé par plusieurs use cases ; il n'est pas nécessaire de créer une implémentation différente pour chaque scénario.

### Résoudre les use cases

Les use cases décrivent leurs dépendances avec `Reader`, puis reçoivent leurs implémentations au moment de la résolution. Le fonctionnement de l'injection, des ports et des `Reader` est documenté dans [la couche applicative](../03-applications/10-use-case.md) ; l'infrastructure en réalise l'assemblage.

`DInvocation.resolveReaders` associe un ensemble de use cases à un même jeu d'implémentations. Dans la [fixture de résolution](../fixtures/infrastructure/useCases/index.ts), l'infrastructure injecte les repositories concrets et expose notamment `useCases.clientRentBookUseCase`.

La résolution ne réimplémente pas l'orchestration métier et ne reconstruit pas les dépendances dans chaque point d'entrée. Elle produit des fonctions prêtes à être consommées avec leurs paramètres métier.

### Raccorder les points d'entrée

Un point d'entrée adapte un moyen de consommation aux capacités de l'application. Il transforme les données externes vers les paramètres attendus, appelle un use case résolu et adapte le résultat vers le contrat du consommateur. Il ne réimplémente pas l'orchestration applicative et ne déclenche pas directement une `Fact`, un agrégat ou un effet.

La nature du protocole ne change pas cette responsabilité. Une route HTTP, une commande ou un autre client peuvent consommer le même use case résolu ; chacun possède sa propre documentation de protocole et son propre contrat de sortie.

La [fixture HTTP de location](../fixtures/infrastructure/http/routes/clientRentBook.ts) et la [fixture de commande de location](../fixtures/infrastructure/command/clientRentBook.ts) illustrent ce raccordement autour d'un même use case. Elles ne constituent pas de nouveaux modèles d'orchestration : elles montrent uniquement deux consommateurs de la même capacité applicative.

Les détails de construction d'une route sont documentés dans [les routes HTTP](../../02-server/20-http/20-route.ts), ceux des vérifications réutilisables dans [les routines HTTP](../../02-server/20-http/30-routine.ts), et ceux des commandes dans [la définition d'une commande](../../02-server/40-command/10-use.ts). La composition des résultats est documentée dans [les fondamentaux `Either`](../../01-fundamental/03-either/30-composition.ts) ; l'adaptation au protocole reste documentée par chaque moyen de consommation.

L'assemblage suit donc ce parcours :

```text
Port applicatif
  ↓ implémentation concrète
Use case résolu par Reader
  ↓ consommation par un point d'entrée
Point d'entrée
  ↓ adaptation au protocole
Contrat du consommateur
```

Le point d'entrée peut qualifier les données lorsqu'il les fait entrer dans le modèle, conformément aux [frontières de l'architecture](../01-architecture/10-boundaries.md). La qualification, la composition des résultats et l'adaptation propre à chaque protocole doivent être recherchées dans leurs ressources dédiées, plutôt que répliquées ici.

### Démarche d'implémentation

1. Lire les contrats des [ports applicatifs](../03-applications/10-use-case.md#déclarer-les-ports-et-construire-le-reader) et identifier les systèmes capables de les implémenter.
2. Fournir une implémentation par port en conservant les signatures et les garanties du contrat.
3. Résoudre les Readers avec `DInvocation.resolveReaders`.
4. Raccorder chaque point d'entrée au use case résolu et à son contrat de consommation.
5. Consulter la documentation du protocole concerné pour implémenter ses mécanismes propres.
