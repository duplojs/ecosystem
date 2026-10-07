# Form

Formulaires déclaratifs et typés : composition de champs, layouts, validations,
états internes et templates de rendu.

L'objectif est d'éviter que chaque écran reconstruise sa propre manière de
gérer les valeurs, les erreurs et les comportements locaux. Le formulaire est
décrit par composition : chaque élément annonce ce qu'il porte, comment il
s'intègre aux autres et quelle place il occupe dans la valeur finale.

Les inputs portent les valeurs, les layouts structurent ou contrôlent leur
composition, et les templates transforment cette structure en interface Vue.
Cette séparation garde un modèle commun pour `currentValue`, `check`, `reset`
et `dispose`, tout en laissant l'application personnaliser les comportements ou
le rendu quand l'interface l'exige.
