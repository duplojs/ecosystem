# Environnement

L'environnement regroupe ce que la plateforme d'exécution fournit à
l'application : système de fichiers, processus courant, dossier de travail,
variables d'environnement ou capacité à exposer une interface HTTP.

DuploJS évite de lier le code applicatif à l'API particulière de Node.js,
Deno ou Bun. Quand les plateformes partagent un modèle proche, le package
serveur expose une API commune. Quand l'intégration dépend davantage du
runtime, elle passe par un connecteur dédié.

Cette partie regroupe donc les outils qui permettent au serveur d'observer son
contexte d'exécution sans disperser les détails de plateforme dans le reste de
l'application.
