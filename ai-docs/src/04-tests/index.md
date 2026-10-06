# Tests

Les tests DuploJS servent à vérifier que le comportement observé reste aligné
avec les contrats exprimés dans le code.

Comme une grande partie du modèle repose sur le typage, tester ne consiste pas
seulement à comparer une valeur finale. Il faut aussi vérifier que le bon flux
est choisi, que les informations portées par les résultats sont interprétées au
bon endroit, et que les garanties TypeScript importantes sont conservées.

Les tests unitaires se concentrent sur une API précise : son résultat runtime,
ses branches possibles et son inférence dans le contexte d'utilisation prévu.

Les tests E2E gardent une autre responsabilité. Ils décrivent un parcours
utilisateur à travers un site réel, en rangeant les pages, composants, actions
et assertions pour que le test reste lisible quand l'interface grandit.
