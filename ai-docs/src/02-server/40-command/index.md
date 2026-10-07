# Créer des commandes

Le domaine commande permet de construire des entrées CLI typées pour une
application serveur.

Une commande décrit les arguments et options qu'elle accepte, puis reçoit ces
valeurs déjà interprétées dans son callback d'exécution. La même déclaration
sert aussi à produire l'aide et les erreurs de ligne de commande.

Les sous-commandes permettent ensuite de structurer une CLI comme un arbre,
sans changer le modèle d'exécution d'une commande simple.
