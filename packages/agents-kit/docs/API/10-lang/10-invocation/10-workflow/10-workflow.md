### Workflows : déroulement et effets

Définir le déroulement attendu d'une opération, déléguer ses besoins extérieurs par des effets et consommer ce parcours avec leurs implémentations.
---

Un workflow définit les grandes règles d'une opération : les étapes à accomplir, les données à transmettre et les résultats nécessaires pour poursuivre. Il porte le parcours où les conditions attendues sont satisfaites, avec les décisions et transformations qui lui appartiennent.

[`createWorkflow`](./10-createWorkflow.ts) fournit les effets à une fonction génératrice. Celle-ci les délègue avec `yield*` et reprend une fois leur demande satisfaite. [`consumeWorkflow`](./10-consumeWorkflow.ts) fournit les implémentations extérieures et conduit l'exécution. Le workflow peut ainsi fixer le déroulement sans connaître la manière dont ses demandes seront réalisées.

| Effet | Intention du workflow | Ressource |
| --- | --- | --- |
| `resolve` | Fournir les entrées nécessaires pour obtenir une valeur attendue et poursuivre avec elle. | [Définir le résultat attendu](./10-resolve.ts). |
| `commit` | Confier une donnée dont le traitement est terminé, à l'étape où cette transmission est nécessaire pour la suite. | [Transmettre une donnée ou exiger une action](./10-commit.ts). |
| `breakIfLeft` | Abréger la propagation d'un refus déjà disponible et extraire la valeur en cas de réussite. | [Interrompre sur un Left](./10-breakIfLeft.ts). |
| `iterate` | Appliquer une succession d'actions à chaque élément fourni par une collection. | [Valider le périmètre puis traiter ses éléments](./10-iterate.ts). |

### Poursuivre tant que les demandes sont satisfaites

Le workflow décrit ce qui doit se passer si les effets satisfont leurs contrats. Un `Left` renvoyé par une implémentation interrompt ce parcours et devient le résultat de sa consommation. Une exception ou une promesse rejetée rejette la promesse de consommation. Le workflow ne poursuit alors pas ses étapes suivantes : les couches qui le consomment décident de la récupération ou de la conséquence à donner à cet arrêt.

Les issues normales qui autorisent différentes branches du workflow peuvent être fournies comme valeurs d'un `Right`. Un refus placé à gauche signifie au contraire que le parcours attendu ne peut plus continuer. Voir la [sélection des résultats](../../10-either/10-keepAsRightByInformation.ts).

L'arrêt ne défait pas les actions déjà réalisées. Le workflow ne crée ni transaction ni compensation ; les garanties nécessaires appartiennent aux contrats et à leurs implémentations. Voir les [garanties d'exécution des use cases](../../../../concepts/05-type-driven-design/03-applications/10-use-case.md#propager-les-arrêts-et-respecter-les-garanties-dexécution).

### Valider une collection avant de la parcourir

Lorsqu'une opération met à jour une collection, établir d'abord que cette mise à jour est possible, par un `resolve` préalable lorsque la vérification demande un contexte extérieur. La valeur obtenue peut porter une preuve de cette validation. L'`iterate` reçoit ensuite ce périmètre validé et applique les actions prévues à chacun de ses éléments.

Dans cette modélisation, le corps de l'itération ne décide pas, au fil des éléments, si la collection peut être traitée et ne sert pas à programmer un arrêt normal du parcours. Ses résultats de réussite ne sont pas accumulés. Les refus et exceptions restent propagés par le consommateur ; cette gestion des défaillances ne remplace pas la validation préalable.

La preuve de validation exprime une garantie de contrat. Si celle-ci doit rester vraie pendant toute la mise à jour, les implémentations doivent la maintenir, par exemple dans le [contexte transactionnel approprié](../../../../concepts/05-type-driven-design/03-applications/10-use-case.md#exécuter-lopération-dans-un-contexte-transactionnel).
