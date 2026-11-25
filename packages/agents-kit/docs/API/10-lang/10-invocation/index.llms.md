## DInvocation

Primitives pour composer des traitements, orchestrer des workflows, exprimer leurs contrats et représenter la provenance des valeurs.

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
 
