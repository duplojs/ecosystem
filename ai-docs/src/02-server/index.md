# Serveur

La partie serveur regroupe les abstractions qui permettent à DuploJS
d'interagir avec une plateforme d'exécution sans enfermer le code dans
l'API propre à Node.js, Deno ou Bun.

Elle ne correspond pas uniquement à la création d'un serveur HTTP.
Elle couvre plus largement les points de contact avec l'environnement :
fichiers, variables d'environnement, commandes, connecteurs HTTP et
ressources fournies par le runtime.

Le principe général est de séparer le modèle DuploJS du détail de la
plateforme. Le code applicatif manipule des abstractions communes, tandis
que les connecteurs adaptent ces abstractions au runtime réellement utilisé.

Cette séparation permet de conserver les mêmes patterns de typage, de
validation et de représentation des erreurs, même lorsque l'application
s'exécute dans des environnements différents.
