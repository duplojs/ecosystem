### Conception des repositories en Type-Driven Design

Contrats des opérations nécessaires au métier dont l'implémentation technique reste extérieure au domaine.
---

### Déclarer une capacité à partir du besoin métier

Dans ce Type-Driven Design, un **repository est, conceptuellement, un agrégat dont l'implémentation ne concerne pas le domaine**. Il est déclaré dans le domaine sous forme de contrat : ses entrées, ses résultats possibles et ses garanties utilisent les types métier ; sa réalisation technique reste extérieure.

Son périmètre suit les capacités que le métier doit nommer : récupération de données, génération de valeurs, vérifications préalables, calculs précis ou envoi de courriels. Le domaine décrit ce qu'il attend sans exposer de requête SQL, de client de base de données ou de configuration de transport.

Les fixtures donnent des contrats adaptés à plusieurs besoins :

| Besoin | Contrat |
| --- | --- |
| Obtenir un identifiant issu de la génération prévue | [`BookRepository.generateId`](../fixtures/business/domains/repositories/book.ts) retourne un `Book.Id` portant l'évidence `generated`. |
| Vérifier une condition du catalogue | `BookRepository.titleIsAlreadyRegistered` retourne une promesse de résultat portant `title-already-registered` ou `title-not-registered`, avec le titre concerné. |
| Retrouver une entité | `BookRepository.findById` et [`ClientRepository.findById`](../fixtures/business/domains/repositories/client.ts) retournent une promesse de `Maybe` contenant l'entité ou représentant son absence. |
| Demander un traitement de disponibilité | `BookRepository.rankAvailability` décrit une fonction signée recevant le livre. |
| Envoyer un courriel de location | [`EmailRepository.sendRentInformationalEmail`](../fixtures/business/domains/repositories/email.ts) décrit une fonction signée recevant le client et le livre. |

Voir [les preuves de passage](../../01-fundamental/06-modeling/50-evidence.ts) et [l'identité des fonctions dans les dépendances](../../01-fundamental/06-modeling/60-signed-function.ts) pour les mécanismes de typage utilisés par ces contrats.

### Relier le contrat aux transactions

Un repository intervient de deux façons auprès des [agrégats](./20-aggregates.md) :

- **Avant la transaction**, son opération fournit des données ou établit une précondition extérieure que l'agrégat exige en entrée. `createBook` utilise ainsi les garanties de génération d'identifiant et de vérification du titre. Pour une recherche, la couche appelante gère l'absence de l'entité et la qualifie selon les besoins de l'opération.
- **Pour les effets attendus**, son contrat définit une dépendance du résolveur retourné par l'agrégat. `clientRentBook` utilise ainsi la signature de `EmailRepository.sendRentInformationalEmail`.

L'application orchestre les appels techniques et la résolution des effets. L'agrégat exploite les résultats préparés ou déclare les effets attendus, sans exécuter l'implémentation du repository.

Lorsqu'une recherche retourne une entité, le repository l'hydrate avant de la transmettre. Une requête peut filtrer sur un état, mais elle ne suffit pas à ajouter le flag : appeler ensuite la qualification du domaine. Si elle révèle un autre état, le repository doit signaler l'incohérence comme une erreur technique.

Une opération de repository peut établir un contexte transactionnel ou une autre garantie d'exécution. Si elle reçoit une callback, son contrat doit préciser que celle-ci est exécutée dans le contexte requis ; l'implémentation ne produit l'évidence associée qu'après avoir réellement établi et exécuté ce contexte. Le domaine peut exiger cette preuve dans une `Fact`, un agrégat ou une étape intermédiaire.

### Respecter les garanties annoncées

**L'implémentation doit réellement établir une condition avant de produire sa preuve.** Le contrat exige la garantie dans le typage ; ajouter une évidence ne réalise pas la vérification technique.

Changer de base de données, de générateur ou de service de courriel préserve les transactions métier tant que les opérations conservent leurs entrées, leurs résultats et le sens des garanties annoncées. La seule compatibilité TypeScript ne suffit pas à respecter ce contrat.
