### Organiser les données dans un conteneur

Périmètre du domaine `container` et critères de choix d'une organisation des données.

---

Le domaine `container` de `@duplojs/lang`, exposé sous le namespace `DContainer`, regroupe différentes structures de données techniques, génériques et indépendantes de la plateforme. Les cellules, listes chaînées circulaires et files d'attente répondent à des besoins particuliers de stockage, d'accès, de parcours ou d'exécution de tâches.

Choisir une structure selon les opérations nécessaires et les garanties recherchées : conserver une valeur partagée, ajouter ou retirer des éléments, parcourir des données dans un ordre donné ou limiter le nombre de tâches exécutées simultanément. Chaque structure possède son propre contrat, notamment pour la mutation, l'ordre des éléments et les modalités d'accès ou de modification.

Les [DataStructure](../10-dataStructure/index.llms.md) décrivent et valident les contrats des données. Les conteneurs portent leur organisation et leur accès. Les transformations fonctionnelles déjà disponibles sur les tableaux, objets et générateurs restent dans leurs domaines respectifs.

Les API s'importent depuis `@duplojs/lang/container` avec le namespace `DContainer`. La fonction [`DContainer.createQueue`](10-createQueue.ts) organise l'exécution des tâches selon une concurrence configurable.
