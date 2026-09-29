# Créer des commandes

`ServerCommand` fournit les outils nécessaires à la création de commandes et de CLI complets.

Une commande peut définir des arguments, des options et leur validation, puis exposer directement ces valeurs typées à son exécution. Les informations déclarées permettent également de générer automatiquement l'aide associée à la commande (--help).

Les commandes peuvent être composées sous forme d'arbre grâce aux sous-commandes, ce qui permet de construire aussi bien une commande simple qu'un CLI plus complexe.