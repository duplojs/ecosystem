### Conception des repositories en Type-Driven Design

Déclaration dans le domaine, indépendance des implémentations techniques, récupération de données, preuves de préconditions et effets requis par les agrégats.
---

### Une opération métier dont l'implémentation reste extérieure

Dans ce Type-Driven Design, un **repository est, conceptuellement, un agrégat dont l'implémentation ne concerne pas le domaine**. Il décrit une opération nécessaire au métier, avec ses entrées et ses résultats attendus. Sa réalisation dépend d'éléments techniques que le métier n'a pas besoin de connaître.

Générer un identifiant peut utiliser une séquence en base de données ou un générateur d'UUID. Rechercher un livre peut consulter PostgreSQL ou une base NoSQL. Le domaine attend un identifiant conforme à son modèle ou le résultat de la recherche ; il ne choisit pas le mécanisme qui les produit.

Le repository est donc **déclaré dans le domaine sous forme de contrat**. Les agrégats restent des fonctions pures : ils exploitent les résultats et les garanties de ces opérations ou déclarent les effets requis, sans exécuter leur implémentation technique.

### Définir le contrat à partir du besoin métier

Les [contrats de repositories des fixtures](../fixtures/business/domains/repositories/index.ts) décrivent les capacités dont les transactions ont besoin. Leurs signatures utilisent les types du domaine et rendent explicites les résultats possibles.

| Besoin | Contrat dans les fixtures |
| --- | --- |
| Obtenir un identifiant issu de la génération prévue | `BookRepository.generateId` retourne un `Book.Id` portant l'évidence `generated`. |
| Vérifier une précondition dépendant du catalogue | `BookRepository.titleIsAlreadyRegistered` retourne une promesse de résultat portant `title-already-registered` ou `title-not-registered`, avec le titre concerné. |
| Retrouver une entité par son identité | `BookRepository.findById` et `ClientRepository.findById` retournent une promesse de `Maybe` contenant l'entité ou représentant son absence. |
| Demander un traitement lié à la disponibilité d'un livre | `BookRepository.rankAvailability` décrit une fonction signée recevant le livre. |
| Envoyer un courriel après une location | `EmailRepository.sendRentInformationalEmail` décrit une fonction signée recevant le client et le livre. |

Voir les contrats de [`BookRepository`](../fixtures/business/domains/repositories/book.ts), [`ClientRepository`](../fixtures/business/domains/repositories/client.ts) et [`EmailRepository`](../fixtures/business/domains/repositories/email.ts).

Dans ce Type-Driven Design, les repositories peuvent couvrir la récupération de données, la génération de valeurs, les vérifications préalables, des calculs précis ou l'envoi de courriels. Leur périmètre suit les capacités techniques que le métier doit nommer. Chaque opération exprime ce que le métier attend, sans exposer une requête SQL, un client de base de données ou une configuration de transport.

### Fournir les données et les preuves avant la transaction

Une précondition peut dépendre d'informations extérieures aux propriétés d'une entité. Le repository réalise alors l'opération qui permet d'établir cette précondition ; l'agrégat exige sa preuve dans ses entrées.

L'[agrégat `createBook`](../fixtures/business/domains/aggregates/createBook.ts) exige deux valeurs issues du contrat de `BookRepository`, à travers `GetEvidenceResult` :

- un identifiant portant l'évidence `generated`, produite par `generateId` ;
- un titre portant l'évidence `title-not-registered`, produite par `titleIsAlreadyRegistered`.

Le [cas d'usage `CreateBookUseCase`](../fixtures/business/applications/useCases/createBook.ts) appelle le repository, sélectionne le résultat indiquant que le titre n'est pas enregistré, génère l'identifiant, puis fournit ces valeurs à l'agrégat. L'agrégat peut créer le livre en s'appuyant sur ces preuves, sans connaître le catalogue ni le générateur utilisés.

Pour une recherche, le même principe permet à la couche appelante de récupérer une entité, de gérer son absence et de la qualifier avant de la transmettre à l'agrégat. Le résultat de la recherche et les préconditions de la transaction remplissent des rôles distincts.

Les évidences rendent les garanties exigibles dans le typage. **L'implémentation du repository doit réellement établir la condition avant de produire sa preuve** : ajouter une évidence ne réalise pas la vérification technique. Voir [les preuves de passage](../../01-fundamental/06-modeling/50-evidence.ts).

### Déclarer un effet sans l'exécuter dans l'agrégat

Une transaction peut aussi requérir une opération technique après avoir produit ses résultats métier. L'agrégat déclare alors cette dépendance dans un résolveur.

L'[agrégat `clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts) exécute les faits de location et retourne les nouvelles entités avec un besoin `sendInformationalEmail`. Le type de ce besoin est directement celui de `EmailRepository.sendRentInformationalEmail`. Le domaine exprime ainsi l'opération attendue et les données à lui fournir.

Le [cas d'usage `ClientRentBookUseCase`](../fixtures/business/applications/useCases/clientRentBook.ts) fournit l'implémentation au résolveur pour déclencher l'envoi. L'agrégat construit le résultat et déclare le besoin ; la couche appelante prend en charge l'exécution de l'effet et son ordre par rapport à la sauvegarde.

Une `SignedFunction` permet ici d'exiger l'identité de l'opération en plus de sa signature d'appel. Voir [l'identité des fonctions dans les dépendances](../../01-fundamental/06-modeling/60-signed-function.ts).

### Préserver le contrat quand la technique change

Une opération de repository peut participer conceptuellement au cycle de vie d'une entité : générer son identité avant sa création, vérifier une condition préalable ou notifier une transition. Le domaine décrit ce rôle ; les détails pratiques restent dans l'implémentation.

Changer de base de données, de générateur ou de service de courriel ne modifie pas la transaction métier tant que les opérations conservent leurs entrées, leurs résultats et les garanties annoncées. **Respecter le contrat comprend le sens métier de ces garanties**, au-delà de la seule compatibilité TypeScript.

Pour concevoir un repository, identifier l'opération dont le métier a besoin, déclarer ses entrées avec les types du domaine, représenter ses résultats possibles et les preuves ou l'identité requises, puis relier ce contrat aux agrégats concernés. Les choix techniques relèvent de son implémentation.

Voir [la conception des entités](./10-entities.md) pour les invariants et les transitions, et [les agrégats](./20-aggregates.md) pour les contrats des transactions métier.
