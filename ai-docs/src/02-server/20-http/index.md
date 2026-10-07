# HTTP

La partie HTTP décrit la manière dont DuploJS structure une application
exposée à travers des routes.

Une application HTTP est organisée autour d'un `Hub`. Il centralise la
configuration, les routes et les plugins, puis délègue le démarrage à un
connecteur propre à la plateforme d'exécution.

Les routes sont décrites comme une succession de steps. Chaque step lit les
données déjà présentes dans le `floor`, peut y ajouter de nouvelles données,
et déclare les réponses qu'elle est capable de produire.

Ce modèle rend explicite le flux d'une requête : extraction des entrées,
validation, vérifications intermédiaires, construction de la réponse finale.
Les `DataStructure` décrivent les données reçues ou renvoyées, tandis que les
`ResponseContract` rendent les sorties possibles visibles dans le typage.

Les routines permettent ensuite de déplacer hors des routes les vérifications
ou enchaînements qui doivent être réutilisés. Elles gardent le même modèle de
steps et de `floor`, mais contrôlent explicitement quelles données peuvent
ressortir vers le flux appelant.

Une opération clairement réutilisable doit être placée dans un `checker`, même
si elle n'est appelée qu'une seule fois aujourd'hui. Une recherche par identifiant
en est un exemple : le checker récupère la donnée et produit des informations
génériques comme `user.find` ou `user.notfound`. La route interprète ces résultats
avec `check`, ou avec un preset qui définit une réponse HTTP récurrente.

Les `cut` restent adaptés aux vérifications propres à l'action ou au use case
appelé par le flux. Leurs informations expriment les conditions de cette action,
par exemple un échec de confirmation d'email. Le choix entre `cut` et checker
dépend donc de la nature de l'opération et de ses informations, pas seulement
de son nombre d'utilisations.

La génération de code s'appuie sur ces déclarations pour produire un contrat
statique partageable avec d'autres services ou applications, sans partager
la codebase qui implémente réellement les routes.
