### Agrégats, preuves et workflows

Définir le déroulement d'une opération métier, les preuves qui l'autorisent et les demandes commit, resolve et iterate que l'application doit satisfaire.

---

### Porter l'opération métier entière

Dans ce Type-Driven Design, un **agrégat est une fonction qui conduit une opération métier**. Il exige ses préconditions, coordonne les [faits](./10-entities.md#définir-le-contrat-dune-transition), relie leurs entrées et leurs sorties et détermine le résultat final.

[`clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts) coordonne ainsi le fait qui ajoute un emprunt au client et celui qui passe le livre à l'état emprunté.

L'agrégat fixe aussi les exigences propres à l'opération. [`CreateBookFact`](../fixtures/business/domains/entities/book/facts/create.ts) reçoit un identifiant et un titre. L'agrégat [`createBook`](../fixtures/business/domains/aggregates/createBook.ts) exige en plus que l'identifiant ait été généré et que le titre ait été vérifié comme absent du catalogue. Le fait reste réutilisable ; ce parcours de création porte ses propres preuves.

Un agrégat reste pur. Il n'appelle ni repository ni callback impure injectée : il transforme les valeurs disponibles et déclare les besoins extérieurs. À entrées et résultats fournis identiques, son raisonnement métier est identique. Un agrégat sans effet à demander peut retourner directement une valeur ou un `Either`.

### Exiger les preuves utiles au parcours

Une [Evidence](../../01-fundamental/06-modeling/50-evidence.ts) rend exigible dans les types une garantie de contexte, une relation entre valeurs ou une provenance.

Un `Book.Title` satisfait ses contraintes de forme, mais ne prouve pas que le catalogue ne contient pas déjà ce titre. Le résultat `title-not-registered` du [repository](../fixtures/business/domains/repositories/book.ts) apporte cette garantie contextuelle. De même, le [refinement client-livre](./40-refinements.md) certifie une combinaison que ni le client seul ni un livre simplement qualifié comme emprunté ne suffisent à établir.

`GetEvidenceResult` permet d'exiger la valeur portant une évidence précise parmi les résultats d'une fonction ou d'une méthode, y compris à travers une promesse, un `Either` ou un générateur. L'agrégat se rattache ainsi au contrat qui définit le résultat attendu sans reprendre l'ensemble de ses issues. Les noms d'évidence distinguent les garanties : deux méthodes annonçant le même type et la même évidence restent compatibles. Une identité d'opération particulière se représente avec une [SignedFunction](../../01-fundamental/06-modeling/60-signed-function.ts).

L'agrégat peut exiger la provenance d'une sélection ou d'un flux, puis transmettre aux faits les entités qualifiées selon leurs propres préconditions.

### Faire du workflow le contrat du déroulement

Le workflow exprime les endroits où l'opération transmet une donnée, attend un contexte supplémentaire ou applique un cycle de vie à une collection. Il précise ce que l'application doit fournir et à quel moment. Les branches métier restent dans l'agrégat ; les appels techniques restent dans l'application.

| Demande | Ce que le domaine impose | Liberté de réalisation technique |
| --- | --- | --- |
| `commit` | Prendre en charge une donnée à cette étape du déroulement. | Réaliser la sauvegarde ou l'action prévue par le contrat. |
| `resolve` | Fournir le résultat qualifié nécessaire pour poursuivre le raisonnement. | Obtenir ce résultat par l'opération extérieure appropriée. |
| `iterate` | Fournir les éléments du périmètre demandé et exécuter le workflow métier pour chacun. | Lire le flux progressivement et organiser son exécution. |

Les fixtures déclarent ces demandes avec `createWorkflow` ; l'[application](../03-applications/10-use-case.md) les satisfait avec `consumeWorkflow`.

### Transmettre une donnée avec commit

Un `commit` indique que la donnée a atteint le point où l'agrégat veut la confier à une opération extérieure. La persistance est un usage fréquent. Le commit peut aussi demander une action, par exemple l'envoi d'un courriel. Sa valeur de retour n'alimente pas le raisonnement métier du générateur.

Dans [`clientRentBook`](../fixtures/business/domains/aggregates/clientRentBook.ts), les faits produisent les nouvelles valeurs du client et du livre. Le premier commit les transmet ensemble ; le suivant demande le courriel d'information. L'application attend la prise en charge du premier avant de poursuivre avec le second.

Si l'identité de l'action importe, `withSignature<EmailRepository["sendRentInformationalEmail"]>()` exige la fonction signée correspondante. Un commit qui transmet simplement une entité laisse au use case le raccordement à sa sauvegarde.

### Obtenir un contexte extérieur avec resolve

Un `resolve` intervient lorsque les données disponibles ne permettent pas de poursuivre la décision métier. Une qualification pure suffit si toute l'information est déjà présente. Quand la réponse dépend d'une collection extérieure potentiellement volumineuse, le domaine exige le résultat utile sans charger cette collection dans ses paramètres.

[`clientGiveBackBook`](../fixtures/business/domains/aggregates/clientGiveBackBook.ts) applique les faits de retour, puis demande la prochaine inscription en attente du livre rendu. Il exige les résultats de `WaitingListEntryRepository.findNextPendingForBook` : une entrée sélectionnée ou la preuve qu'aucune entrée n'est en attente.

Ces deux issues permettent de continuer. Sans inscription, l'agrégat transmet le livre disponible et le client. Avec une inscription, il applique les faits de réservation du livre et de préparation de l'entrée, puis transmet les trois entités. La décision de réserver appartient entièrement au domaine ; l'application fournit le contexte qui la rend possible.

Le [repository](./30-repositories.md#décrire-la-garantie-au-delà-de-la-forme) précise les garanties de sélection ; l'[application](../03-applications/10-use-case.md#propager-les-arrêts-et-respecter-les-garanties-dexécution) traite l'impossibilité de satisfaire la résolution.

### Faire vivre chaque élément d'un flux avec iterate

Un `iterate` exprime qu'une même opération métier doit s'appliquer à chaque élément d'un ensemble. Il permet de parcourir un volume non borné sans réunir toutes les entités en mémoire et de conserver les transitions du domaine pour chacune.

[`withdrawBook`](../fixtures/business/domains/aggregates/withdrawBook.ts) reçoit un livre disponible ou réservé : il est encore à la bibliothèque. Après le fait de retrait et le commit du livre, il demande toutes les entrées actives de sa liste d'attente. Chaque élément doit porter la preuve du résultat de `WaitingListEntryRepository.findAllActiveByBook` et contenir une entrée en attente ou prête.

Le workflow imbriqué applique `CancelWaitingListEntryFact` avec le motif `book-withdrawn`, puis transmet l'entrée annulée par un commit. Une mise à jour globale en base contournerait ces faits et leurs préconditions. Le domaine conserve le choix de la transition et de son motif ; l'application fournit la génératrice asynchrone et le degré de concurrence.

Le résultat final est le livre retiré ; le workflow n'accumule pas les entrées traitées. Le [use case de retrait](../fixtures/business/applications/useCases/withdrawBook.ts) montre le raccordement du flux et des commits. Les conséquences d'un arrêt après des effets déjà exécutés sont décrites dans la [consommation applicative](../03-applications/10-use-case.md#propager-les-arrêts-et-respecter-les-garanties-dexécution).
