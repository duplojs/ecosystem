# Arbre, aide et résultat d'exécution

## Commandes nommées et racine

Une commande créée par `DSCommand.create` est une valeur à exporter puis importer dans le module qui assemble le parent. La placer dans les `subjects` du parent ; il n'y a pas de découverte automatique des fichiers. L'[exemple CLI](examples/cli.ts) importe explicitement sa sous-commande.

La sélection descend immédiatement vers la sous-commande lorsque le premier argument correspond à son nom. Le parent ne constitue donc ni un middleware ni une source d'options communes. Pour appeler `my-cli preview ...`, placer les options de `preview` après son nom et les déclarer sur cette commande. Mutualiser au besoin les déclarations d'options, puis les inclure dans les commandes concernées.

Le callback du parent traite son invocation sans sous-commande. Lui donner un comportement utile selon le projet, par exemple indiquer les actions disponibles. L'aide intégrée répond à `my-cli --help` et `my-cli preview --help` sans exécuter les callbacks correspondants.

## Résultats et erreurs

`DSCommand.exec` lit les arguments du processus. Une erreur de décodage ou de validation est déjà affichée et revient dans un `DEither.Error<DSCommand.Error>` ; le callback de la commande sélectionnée ne s'exécute pas. Une exécution réussie, y compris l'affichage de l'aide, renvoie `DEither.Ok`.

Ce résultat ne fixe pas à lui seul un code de sortie d'échec. À la frontière du programme, le discriminer avec `DEither.isLeft` et, si le contrat du binaire le demande, terminer avec `DSCommon.exitProcess(1)` depuis `@duplojs/server/common`, comme dans l'exemple CLI. Éviter d'afficher une seconde fois le même diagnostic.

Les échecs métier restent à interpréter dans le callback qui consomme l'application : afficher le message adapté et choisir la conséquence pour le programme. Le callback attend une valeur `void` ou une promesse de `void` ; lui retourner un `Either` métier ne constitue pas un mécanisme de propagation. `exec` ne convertit pas les exceptions du callback en erreurs de validation.

Pour adapter les messages des data structures, `exec` et `execOptions` acceptent `dataStructureErrorInterpreter`.

## Script recevant uniquement des options

`DSCommand.execOptions` renvoie un résultat à trois branches : `success` contient les options validées, `log-help` indique que l'aide a déjà été affichée, et un `Left` porte l'erreur déjà affichée. Discriminer le succès avec `DEither.hasInformation(result, "success")` avant de déballer et de lancer le travail ; une aide est aussi un `Right`.

Lire l'[exemple de script](examples/options-only.ts). Réserver cette forme aux scripts sans arguments positionnels ni arbre de commandes : elle ne vérifie pas les arguments restants après extraction des options.

## Exposer le binaire

Réutiliser le mode d'exécution du projet. Pour un package compilé sous Node, placer un shebang `#!/usr/bin/env node` au début du point d'entrée généré et faire pointer le champ `bin` du `package.json` vers ce fichier exécutable. L'exemple `cli.ts` suppose une compilation qui conserve ce shebang. Si le projet exécute directement du TypeScript, utiliser son interpréteur et le shebang correspondants plutôt que pointer Node sur un TypeScript non pris en charge par sa configuration.

Vérifier que le fichier déclaré dans `bin` est produit, inclus dans le package distribué et exécutable. Tester ensuite la commande depuis un projet consommateur ou une installation locale du package.
