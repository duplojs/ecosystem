# Form

Les formulaires sont souvent une source de logique dispersée : chaque écran
peut finir avec sa propre manière de gérer les valeurs, les erreurs, les
validations, les états internes et le rendu.

La partie form de DuploJS répond à ce problème en proposant une façon unique,
déclarative et typée de construire un formulaire. Au lieu d'assembler les
comportements de manière impérative, le formulaire est décrit par composition :
chaque élément annonce ce qu'il porte, comment il s'intègre aux autres, et
quelle place il occupe dans la valeur finale.

Cette approche rend le modèle plus constant et plus robuste. Elle couvre déjà
beaucoup de formes de formulaires avec les briques fournies, mais reste
extensible lorsque l'interface demande un comportement ou un rendu spécifique.
