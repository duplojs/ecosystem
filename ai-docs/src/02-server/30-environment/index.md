# Environnement

L'environnement représente les ressources et les informations fournies par
la plateforme sur laquelle s'exécute une application.

Cela comprend notamment le système de fichiers, le processus courant,
le dossier de travail, les variables d'environnement ou encore les
fonctionnalités permettant d'exposer un serveur HTTP.

DuploJS fournit des abstractions permettant d'utiliser ces fonctionnalités
sans dépendre directement de l'API propre à Node.js, Deno ou Bun.

Lorsque les plateformes proposent des fonctionnalités suffisamment proches,
elles sont exposées à travers une API commune. Lorsque leurs modèles diffèrent
davantage, l'intégration peut être réalisée à travers un connecteur.
