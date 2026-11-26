### Organiser les données dans un conteneur

Périmètre du domaine `container` et critères de choix d'une organisation des données.

---

Le domaine `container` de `@duplojs/lang`, exposé sous le namespace `DContainer`, a vocation à regrouper les piles, maps, sets, listes chaînées et autres conteneurs génériques indépendants de la plateforme.

Le choix d'un conteneur dépend des opérations nécessaires : ajout, retrait, recherche, accès par clé ou parcours. Les garanties d'ordre, d'unicité et de coût d'accès ou de modification devront être précisées par le contrat de chaque conteneur.

Les [DataStructure](../10-dataStructure/index.llms.md) décrivent et valident les contrats des données. Les conteneurs portent leur organisation et leur accès. Les transformations fonctionnelles déjà disponibles sur les tableaux, objets et générateurs restent dans leurs domaines respectifs.

Le domaine est initialisé sans primitive. Ses futures API s'importeront depuis `@duplojs/lang/container` avec le namespace `DContainer`.
