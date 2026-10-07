# HTTP

Une application HTTP DuploJS décrit l'interface par laquelle un domaine reçoit une requête, valide ses entrées, exécute un flux explicite et produit une réponse contextualisée.

Le `Hub` regroupe la configuration, les routes et les plugins de cette interface.

Une route n'est pas un objet métier : elle organise le passage entre protocole HTTP et logique applicative. Ses étapes valident les données de requête, partagent un contexte de traitement et déclarent les réponses que le flux peut produire.

Les routines déplacent les vérifications et séquences réutilisables hors des routes sans cacher les données qui entrent ou ressortent du flux.

La génération de code transforme ces déclarations en contrat statique partageable sans exposer la codebase serveur.
