---
name: duplojs-unit-tests
description: Créer, modifier ou corriger des tests unitaires dans le monorepo DuploJS, notamment pour tester un comportement, ajouter des cas de test ou améliorer la couverture.
---

# Tests unitaires

Les tests unitaires doivent vérifier que l'exécution respecte l'intention du code.

L'intention n'est pas toujours explicitement documentée. Lorsqu'elle peut être déduite du typage, la déclaration de type doit être considérée comme la référence principale du comportement attendu.

Les tests doivent être écrits à partir de cette intention et non simplement reproduire le comportement observé à l'exécution.

Si une incohérence est constatée ou suspectée entre le typage et le comportement réel :

* ne pas modifier l'implémentation pour faire passer les tests ;
* ne pas adapter les tests au comportement observé ;
* conserver l'état actuel du comportement ;
* signaler explicitement l'incohérence au développeur.

L'ajout d'un export manquant dans un barrel du package est toutefois autorisé lorsqu'il est strictement nécessaire pour rendre le module accessible aux tests.


L'objectif minimal est d'obtenir **100 % de couverture**.

La couverture d'exécution ne suffit cependant pas. Les garanties apportées par le typage doivent également être testées, y compris lorsque certains tests semblent redondants du point de vue du runtime.

## Workflow

1. Identifier le package et le module concernés.
2. Déterminer l'intention à partir de l'API et de son typage.
3. Lire les conventions du projet dans [references/project-conventions.md](references/project-conventions.md).
4. Identifier les différentes formes de déclaration exposées par le module.
5. Appliquer les patterns correspondants décrits dans [references/test-patterns.md](references/test-patterns.md).
6. Créer ou modifier les tests nécessaires.
7. Valider les tests selon [references/execution.md](references/execution.md).
8. Vérifier que le comportement runtime et les garanties de typage sont couverts.
9. Si une incohérence entre typage et exécution apparaît, arrêter toute tentative de correction et la signaler.
