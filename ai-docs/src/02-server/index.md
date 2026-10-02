# Serveur

Un serveur DuploJS est pensé comme un modèle applicatif indépendant du runtime
qui l'exécute.

Le code décrit ses points de contact avec l'environnement à travers des
abstractions communes : exposer une interface HTTP, manipuler des fichiers,
lire la configuration d'exécution ou construire des commandes. Le détail propre
à Node.js, Deno ou Bun reste porté par les connecteurs ou les implémentations
de plateforme.

Cette séparation permet de conserver les mêmes patterns de typage, de
validation et de représentation des erreurs, même lorsque l'application
s'exécute dans des environnements différents. HTTP y occupe une place
centrale, sans réduire le serveur à cette seule feature : les routes
structurent le flux applicatif, tandis que les autres abstractions assurent
le lien avec le runtime.
