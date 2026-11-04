### Frontières entre domaine, application et infrastructure

Responsabilités des couches, sens des dépendances et préparation des garanties aux frontières du système.

---

### Faire du domaine le contrat de l'opération

Le domaine traduit les exigences du monde réel en états, préconditions, transitions et opérations coordonnées. Il définit ce qui doit se passer et les garanties nécessaires pour continuer.

| Couche | Responsabilité | Exemple du retour d'un livre |
| --- | --- | --- |
| Domaine | Définir les états autorisés, les faits, leur enchaînement et les capacités extérieures requises. | Exiger le lien client-livre, rendre le livre, demander la prochaine inscription en attente et réserver le livre si une inscription existe. |
| Application | Satisfaire les préconditions et les effets de l'agrégat avec des ports abstraits. | Fournir le résultat de sélection attendu, sauvegarder les entités transmises et propager une indisponibilité. |
| Infrastructure | Réaliser les ports et adapter les points d'entrée aux contrats applicatifs. | Interroger le stockage, hydrater les entités et convertir le résultat en réponse HTTP. |

Une règle encore à décider dans un use case ou un adaptateur indique un contrat métier incomplet. Les couches techniques conservent leurs choix d'implémentation, mais ces choix doivent respecter les garanties définies dans le domaine.

### Sens des dépendances

```text
Infrastructure → Application → Domaine
Infrastructure → Domaine
```

Le domaine n'importe ni l'application ni l'infrastructure. Il décrit ses besoins extérieurs par des [repositories](../02-domains/30-repositories.md) et ses demandes d'effets par des [workflows](../02-domains/20-aggregates.md). Il n'appelle aucune implémentation technique.

L'application définit les ports de ses use cases ; l'infrastructure les implémente. Changer de base de données ou de protocole d'entrée ne change donc pas les transitions du domaine.

### Respecter les responsabilités aux frontières

Un point d'entrée peut lire des données par un repository et appeler les qualifications pures du domaine pour préparer les paramètres d'un use case. Une lecture seule, comme `findById`, ne demande pas un use case de relais.

Dès que l'opération conduit un cycle de vie ou des effets métier, le point d'entrée passe par un use case. Il n'appelle directement ni fait ni agrégat, et ne modifie pas une entité pour réaliser une transition. Les fonctions du domaine restent responsables de la vérification qui établit un flag ou une preuve combinatoire.

La signature du use case indique les [préconditions à préparer](../03-applications/10-use-case.md#préparer-les-préconditions-demandées) par le point d'entrée.

### Faire circuler les garanties et les résultats

Les structures du domaine valident les entrées externes et hydratent les données existantes. Les qualifications, refinements et repositories établissent les garanties exigées par l'opération.

Le domaine distingue les issues qui ont un sens pour son raisonnement. L'application sélectionne celles qui permettent de poursuivre et propage les refus, y compris les résultats techniques ajoutés par ses ports. L'infrastructure adapte le résultat final au consommateur : statut HTTP, sortie de commande ou autre protocole.

Le traitement des refus prévisibles et des défaillances imprévues suit les [règles des résultats et exceptions](../../01-fundamental/03-either/50-external-results.ts).
