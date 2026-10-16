# Structures et contraintes de ressources

`DSDataStructure.file()` et `folder()` étendent les data structures de `@duplojs/lang/dataStructure` avec des valeurs `DSFile.FileInterface` et `FolderInterface`. Employer les structures fondamentales de `lang` pour les objets et les valeurs ordinaires, puis les structures serveur pour les ressources du système de fichiers.

Choisir la validation d'après la représentation reçue :

- Une interface déjà construite se vérifie avec `asyncCheck` lorsque des contraintes asynchrones sont présentes. Un objet ordinaire portant seulement une propriété `path` n'est pas une interface de fichier DuploJS.
- Un chemin textuel se décode avec `asyncDecode(DSDataStructure.codecsString, valeur)`. Le codec normalise le chemin et construit une interface ; sans contrainte supplémentaire, il ne consulte pas la ressource sur le disque.
- Pour le transport sous forme JSON, les codecs serveur `codecsJson` représentent aussi les interfaces par leur chemin.

Ajouter `fileExist()` pour exiger un fichier existant ou `folderExist()` pour exiger un dossier existant. Ces contraintes inspectent les métadonnées et distinguent fichier et dossier. `size({ min, max })` vérifie la taille d'un fichier en octets ; les bornes acceptent des nombres ou les unités textuelles reconnues par l'écosystème. Ces contraintes nécessitent l'exécution asynchrone de la structure. Voir [décodage d'un chemin avec contraintes de fichier](examples/file-structure.ts).

La validation d'une ressource porte sur son état au moment de la vérification. Elle ne réserve pas le fichier et ne dispense pas de traiter le résultat des I/O suivantes. Une structure de fichier ne valide pas non plus ses données internes : lire le texte ou le JSON avec `DSFile`, puis appliquer la structure du contenu attendu.

Le type MIME fourni par une `FileInterface` est déduit de l'extension ; il ne constitue pas une inspection du contenu. Ne pas en déduire une preuve sur les octets du fichier.
