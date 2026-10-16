# Des preuves aux points d'entrée

Les chemins `docs/` ci-dessous se résolvent depuis la racine du package `@duplojs/agents-kit` installé, retrouvée selon le `SKILL.md`.

## Obtenir le résultat attendu

Pour chaque paramètre d'agrégat portant une évidence, retrouver la méthode de repository et la variante demandées par `GetEvidenceResult`. Appeler cette méthode, puis discriminer son résultat avant de poursuivre. Une méthode peut produire plusieurs évidences : seule la branche exigée satisfait la précondition. Traiter ou propager les autres branches sans appeler l'agrégat.

Pour une preuve de provenance, lire `docs/concepts/01-fundamental/06-modeling/50-evidence.ts`. Pour préparer et composer les entrées d'un use case, lire `docs/concepts/05-type-driven-design/03-applications/10-use-case.md`, qui relie la fixture `createBook`. Les mécanismes de sélection et de regroupement des résultats y sont expliqués ; les appliquer aux branches exigées par le contrat du projet.

Une évidence exprime une garantie de contrat, sans effectuer de contrôle runtime. L'implémentation doit réellement exécuter l'opération annoncée avant de produire sa preuve. `GetEvidenceResult` extrait les types du contrat de la méthode ; il ne crée pas une identité nominale propre à chaque méthode. Si deux provenances doivent être distinguées, employer des noms d'évidence distincts. Une `SignedFunction` identifie quant à elle l'opération fournie comme dépendance.

## Propager les exigences vers l'appelant

Choisir la frontière qui possède l'information et peut établir la preuve :

| Entrée attendue | Préparation |
| --- | --- |
| Valeur métier | Réutiliser sa structure dans le schéma du point d'entrée. |
| Entité existante | Appeler le repository qui l'hydrate ; gérer son absence. |
| Entité portant un flag | Appeler sa qualification et sélectionner la branche requise. |
| Valeur portant une évidence | Appeler l'opération prévue par le contrat et sélectionner son résultat. |

Un use case peut recevoir directement une entité qualifiée, ou effectuer lui-même sa récupération et sa qualification selon son contrat. Conserver les exigences explicites dans sa signature lorsqu'elles incombent à l'appelant. La frontière externe transforme les entrées brutes avec les structures du domaine et traite les refus ; elle ne fabrique pas des flags ou des évidences pour satisfaire la signature.

Pour raccorder un point d'entrée ou implémenter un port, lire `docs/concepts/05-type-driven-design/04-infrastructure/10-implementation.md`. Cette page relie les exemples HTTP et CLI consommant le même use case. Les lectures seules ne nécessitent pas un use case intermédiaire ; une règle ou un effet métier supplémentaire doit rejoindre le domaine et l'application concernés.

## Fournir les dépendances et exécuter les effets

Les repositories du domaine décrivent les capacités extérieures requises par le métier. Les ports applicatifs peuvent les compléter avec les besoins techniques du use case, par exemple `save`. Déclarer chaque port avec `DInvocation.createPort`, puis le use case avec `createReader`. L'infrastructure fournit `Port.createImplementation` et résout les Readers avec `Reader.run` ou `resolveReaders`.

Reader injecte les dépendances ; Resolver exécute les effets déclarés par l'agrégat. Pour modifier leur assemblage, consulter dans les pages sélectionnées le nommage des dépendances injectées et les contrats de résolution. Pour changer le contrat métier des effets, lire aussi `docs/concepts/05-type-driven-design/02-domains/20-aggregates.md`.

Fixer l'ordre des effets et de la persistance selon le contrat métier. Si un effet nécessaire échoue, interrompre les étapes qui supposent son succès. `runAndResolve` permet d'exécuter une étape avant les effets ; des sauvegardes parallèles ne fournissent pas d'atomicité. Si le domaine exige une transaction, une sauvegarde ou un contexte spécifique, l'exprimer par le contrat et les preuves appropriées, puis l'établir réellement dans l'implémentation du port.

Un flag ou une évidence établis avant une écriture ne garantissent pas à eux seuls l'absence de concurrence entre temps. Lorsque cette garantie est requise, la prévoir dans l'orchestration et le mécanisme de persistance. Conserver les refus métier dans les résultats attendus ; traiter une incohérence de données ou une panne imprévue comme une erreur technique selon le contrat existant.
