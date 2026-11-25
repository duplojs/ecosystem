## DInvocation

Primitives pour composer des traitements, orchestrer des workflows, exprimer leurs contrats et représenter la provenance des valeurs.

### [DInvocation — Résultats supplémentaires](10-additionalResult.ts)

Étendre les résultats d'une fonction ou des méthodes d'un contrat.
 
### [DInvocation — Évidences](10-evidence.ts)

Associer une preuve de provenance à une valeur et sélectionner les résultats qui la portent.
 
### [DInvocation — Ports](10-port.ts)

Déclarer un contrat injectable et créer son implémentation.
 
### [DInvocation — Readers](10-reader.ts)

Déclarer et résoudre des dépendances à des ports et à d'autres readers.
 
### [DInvocation — Resolvers](10-resolver.ts)

Exiger l'exécution d'actions avant de récupérer une valeur.
 
### [DInvocation — Signatures](10-signature.ts)

Identifier une fonction au-delà de son contrat TypeScript.
 
### [DInvocation — Steps](10-step.ts)

Interrompre un traitement pour déléguer une étape avant de le poursuivre.
 
### [DInvocation.aborter](10-flow/10-aborter.ts)

Fournir un signal d'annulation à une étape et interrompre son exécution précédente.
 
### [DInvocation.debounce](10-flow/10-debounce.ts)

Ne poursuivre que la dernière exécution après une période sans nouvelle arrivée.
 
### [DInvocation.exclusive](10-flow/10-exclusive.ts)

Refuser les exécutions concurrentes d'un flow pendant qu'une exécution est en cours.
 
### [DInvocation.filter](10-flow/10-filter.ts)

Poursuivre un flow avec une valeur ou l'interrompre sur un Left.
 
### [DInvocation.flow](10-flow/10-flow.ts)

Préparer une fonction composée d'étapes synchrones ou asynchrones et de contrôleurs de flux.
 
### [DInvocation.retry](10-flow/10-retry.ts)

Réexécuter les étapes précédentes d'un flow tant qu'elles renvoient un Left.
 
### [DInvocation.throttling](10-flow/10-throttling.ts)

Réguler la poursuite des exécutions d'un flow sur un intervalle de temps.
 
### [DInvocation.timeout](10-flow/10-timeout.ts)

Ajouter une pause entre les étapes d'un flow.
 
### [Workflows : déroulement et effets](10-workflow/10-workflow.md)

Définir le déroulement attendu d'une opération, déléguer ses besoins extérieurs par des effets et consommer ce parcours avec leurs implémentations.

### [DInvocation.workflowBreakIfLeftGenerator](10-workflow/10-breakIfLeft.ts)

Propager un Left déjà disponible ou poursuivre avec la valeur d'un Right sans écrire de garde manuelle.
 
### [DInvocation.workflowCommitGenerator](10-workflow/10-commit.ts)

Confier des données à une action extérieure et, au besoin, exiger une fonction avec withSignature.
 
### [DInvocation.consumeWorkflow](10-workflow/10-consumeWorkflow.ts)

Satisfaire les effets d'un workflow et restituer son résultat ou le refus qui interrompt son parcours.
 
### [DInvocation.createWorkflow](10-workflow/10-createWorkflow.ts)

Déclarer un parcours avec des effets et composer ses étapes par délégation de génératrices.
 
### [DInvocation.workflowIterateGenerator](10-workflow/10-iterate.ts)

Traiter chaque élément d'une collection validée avec une concurrence choisie à la consommation.
 
### [DInvocation.workflowResolveGenerator](10-workflow/10-resolve.ts)

Demander une valeur extérieure avec des entrées et définir son contrat par inférence contextuelle ou avec expect.
 
