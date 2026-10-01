# Client HTTP

Le client HTTP permet de consommer une interface HTTP DuploJS à partir d'un
contrat statique partagé.

Ce contrat décrit les routes disponibles, leurs entrées et leurs réponses. Le
client s'appuie dessus pour construire les requêtes et typer les réponses sans
réécrire le modèle exposé par le serveur.

L'idée principale est de garder le lien entre la route appelée et les réponses
qu'elle peut produire. Les `information` déclarées côté HTTP deviennent alors
le moyen discriminer une réponse précis côté client.
