# Serveur

La partie serveur regroupe les abstractions qui relient une application
DuploJS à son environnement d'exécution.

Elle couvre les points de contact avec le runtime : interface HTTP, système de
fichiers, variables d'environnement, processus courant et commandes CLI. Le
code applicatif peut ainsi rester organisé autour de contrats typés, tandis que
les détails propres à Node.js, Deno ou Bun restent portés par les connecteurs
ou les implémentations de plateforme.

HTTP structure le flux exposé aux clients. Les autres domaines servent à
manipuler les ressources du runtime sans disperser ces dépendances dans le
reste de l'application.
