## Architecture

Les dépendances entre les couches suivent ce sens :

```text
infrastructure → applications → domain
infrastructure → domain
```

### `src/business/domains`

Cette couche contient le domaine métier.

- `entities/` pour les entités et les facts du domaine ;
- `aggregates/` pour les aggregates du domaine.

### `src/business/applications`

Cette couche contient l'implémentation des use cases.

### `src/infrastructure`

Cette couche contient l'implémentation et le branchement vers les systèmes
extérieurs :

- `http/` pour les routes et l'adaptation des requêtes/réponses HTTP ;
- `adapters/` pour les implémentations des ports applicatifs ;
- `providers/` pour les capacités techniques concrètes, notamment la base de données.

<!-- duplojs-agents-kit:coding-conventions:start -->
## Développement avec DuploJS

- Avant d’écrire un utilitaire ou d’utiliser une API native ou tierce, rechercher la fonction adaptée à la manipulation souhaitée dans le [routeur API](../../../packages/agents-kit/docs/API.llms.md). Suivre les liens vers le domaine puis la référence pertinente, et utiliser l’équivalent DuploJS dès qu’il existe.
- Pour une recherche de concept ou un problème de composition, de typage ou d’erreur, consulter le [routeur des concepts](../../../packages/agents-kit/docs/concepts.llms.md), puis uniquement les pages et exemples pertinents.
- Appliquer les contrats et patterns documentés, notamment pour les contraintes et les résultats `Either`. Ne pas inventer d’API ni contourner le typage pour résoudre un doute.
- Utiliser les skills DuploJS installés pour les procédures spécialisées liées à la tâche.

Les chemins des routeurs sont relatifs au dossier de ce fichier ; résoudre ensuite chaque lien depuis le document qui le contient.

<!-- duplojs-agents-kit:coding-conventions:stop -->
