# Client HTTP

Consommation typée d'une interface HTTP DuploJS à partir de son contrat
statique : initialisation du client, requêtes disponibles, réponses attendues
et réactions communes au cycle des échanges.

Le client conserve le lien entre une route appelée et les réponses qu'elle peut
produire. Les `information` déclarées côté serveur deviennent le discriminant
principal pour traiter un cas de réponse précis côté client.
