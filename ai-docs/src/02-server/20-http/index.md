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

La génération de code s'appuie sur ces déclarations pour produire un contrat
statique partageable avec d'autres services ou applications, sans partager
la codebase qui implémente réellement les routes.
