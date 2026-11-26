### Organiser les données dans un conteneur

Périmètre du domaine `container` et critères de choix d'une organisation des données.

---

Le domaine `container` de `@duplojs/lang`, exposé sous le namespace `DContainer`, regroupe des structures de données techniques, génériques et indépendantes de la plateforme. Elles définissent différentes manières d'organiser les données, d'y accéder et de les manipuler selon les besoins d'un traitement.

Choisir une structure selon les opérations nécessaires et les garanties recherchées. Chaque structure possède son propre contrat, notamment pour la mutation, l'ordre des éléments et les modalités d'accès ou de modification.

Les [DataStructure](../10-dataStructure/index.llms.md) décrivent et valident les contrats des données. Les conteneurs portent leur organisation et leur accès. Les transformations fonctionnelles déjà disponibles sur les tableaux, objets et générateurs restent dans leurs domaines respectifs.

Les API s'importent depuis `@duplojs/lang/container` avec le namespace `DContainer`.
